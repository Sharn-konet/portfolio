// Custom math expression parser for ODE DSL
// Zero dependencies — tokenize → parse → compile pipeline
// Inspired by the @ODE macro in Flo.jl

import type { Vec3, DerivativeFn } from './attractors';

// ============================================
// Tokenizer
// ============================================

type TokenType = 'NUMBER' | 'IDENT' | 'OP' | 'LPAREN' | 'RPAREN' | 'COMMA';

interface Token {
	type: TokenType;
	value: string;
}

const TOKEN_RE =
	/(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|([a-zA-Z_]\w*)|([+\-*/^])|(\()|(\))|(,)/g;

function tokenize(expr: string): Token[] {
	const tokens: Token[] = [];
	let match: RegExpExecArray | null;
	TOKEN_RE.lastIndex = 0;
	while ((match = TOKEN_RE.exec(expr)) !== null) {
		if (match[1]) tokens.push({ type: 'NUMBER', value: match[1] });
		else if (match[2]) tokens.push({ type: 'IDENT', value: match[2] });
		else if (match[3]) tokens.push({ type: 'OP', value: match[3] });
		else if (match[4]) tokens.push({ type: 'LPAREN', value: '(' });
		else if (match[5]) tokens.push({ type: 'RPAREN', value: ')' });
		else if (match[6]) tokens.push({ type: 'COMMA', value: ',' });
	}
	return tokens;
}

// ============================================
// AST Types
// ============================================

type ASTNode =
	| { type: 'number'; value: number }
	| { type: 'ident'; name: string }
	| { type: 'binary'; op: string; left: ASTNode; right: ASTNode }
	| { type: 'unary'; op: string; operand: ASTNode }
	| { type: 'call'; name: string; args: ASTNode[] };

// ============================================
// Recursive Descent Parser
// ============================================

const MATH_FUNCTIONS = new Set([
	'sin',
	'cos',
	'tan',
	'asin',
	'acos',
	'atan',
	'exp',
	'abs',
	'sqrt',
	'log',
	'pow',
	'floor',
	'ceil',
	'sign',
	'tanh',
	'sinh',
	'cosh',
]);

class Parser {
	private tokens: Token[];
	private pos: number;

	constructor(tokens: Token[]) {
		this.tokens = tokens;
		this.pos = 0;
	}

	private peek(): Token | null {
		return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
	}

	private consume(): Token {
		return this.tokens[this.pos++];
	}

	private expect(type: TokenType, value?: string): Token {
		const tok = this.peek();
		if (!tok || tok.type !== type || (value !== undefined && tok.value !== value)) {
			throw new Error(
				`Expected ${value ?? type}, got ${tok ? `'${tok.value}'` : 'end of expression'}`
			);
		}
		return this.consume();
	}

	parse(): ASTNode {
		const node = this.parseAdditive();
		if (this.pos < this.tokens.length) {
			throw new Error(`Unexpected token '${this.tokens[this.pos].value}'`);
		}
		return node;
	}

	// Precedence 1: + -
	private parseAdditive(): ASTNode {
		let left = this.parseMultiplicative();
		while (this.peek()?.type === 'OP' && (this.peek()!.value === '+' || this.peek()!.value === '-')) {
			const op = this.consume().value;
			const right = this.parseMultiplicative();
			left = { type: 'binary', op, left, right };
		}
		return left;
	}

	// Precedence 2: * /
	private parseMultiplicative(): ASTNode {
		let left = this.parseExponent();
		while (this.peek()?.type === 'OP' && (this.peek()!.value === '*' || this.peek()!.value === '/')) {
			const op = this.consume().value;
			const right = this.parseExponent();
			left = { type: 'binary', op, left, right };
		}
		return left;
	}

	// Precedence 3: ^ (right-associative)
	private parseExponent(): ASTNode {
		const base = this.parseUnary();
		if (this.peek()?.type === 'OP' && this.peek()!.value === '^') {
			this.consume();
			const exp = this.parseExponent(); // right-associative recursion
			return { type: 'binary', op: '^', left: base, right: exp };
		}
		return base;
	}

	// Precedence 4: unary -
	private parseUnary(): ASTNode {
		if (this.peek()?.type === 'OP' && this.peek()!.value === '-') {
			this.consume();
			const operand = this.parseUnary();
			return { type: 'unary', op: '-', operand };
		}
		return this.parseAtom();
	}

	// Precedence 5: atoms — numbers, identifiers, function calls, parens
	private parseAtom(): ASTNode {
		const tok = this.peek();
		if (!tok) throw new Error('Unexpected end of expression');

		if (tok.type === 'NUMBER') {
			this.consume();
			return { type: 'number', value: parseFloat(tok.value) };
		}

		if (tok.type === 'IDENT') {
			this.consume();
			// Check for function call
			if (this.peek()?.type === 'LPAREN' && MATH_FUNCTIONS.has(tok.value)) {
				this.consume(); // eat '('
				const args: ASTNode[] = [];
				if (this.peek()?.type !== 'RPAREN') {
					args.push(this.parseAdditive());
					while (this.peek()?.type === 'COMMA') {
						this.consume();
						args.push(this.parseAdditive());
					}
				}
				this.expect('RPAREN');
				return { type: 'call', name: tok.value, args };
			}
			return { type: 'ident', name: tok.value };
		}

		if (tok.type === 'LPAREN') {
			this.consume();
			const node = this.parseAdditive();
			this.expect('RPAREN');
			return node;
		}

		throw new Error(`Unexpected token '${tok.value}'`);
	}
}

function parseExpression(expr: string): ASTNode {
	const tokens = tokenize(expr);
	if (tokens.length === 0) throw new Error('Empty expression');
	return new Parser(tokens).parse();
}

// ============================================
// Compiler — AST → JS expression string
// ============================================

const MATH_FN_MAP: Record<string, string> = {
	sin: 'Math.sin',
	cos: 'Math.cos',
	tan: 'Math.tan',
	asin: 'Math.asin',
	acos: 'Math.acos',
	atan: 'Math.atan',
	exp: 'Math.exp',
	abs: 'Math.abs',
	sqrt: 'Math.sqrt',
	log: 'Math.log',
	pow: 'Math.pow',
	floor: 'Math.floor',
	ceil: 'Math.ceil',
	sign: 'Math.sign',
	tanh: 'Math.tanh',
	sinh: 'Math.sinh',
	cosh: 'Math.cosh',
};

function compileAST(node: ASTNode): string {
	switch (node.type) {
		case 'number':
			return String(node.value);
		case 'ident':
			return node.name;
		case 'binary':
			if (node.op === '^') {
				return `Math.pow(${compileAST(node.left)},${compileAST(node.right)})`;
			}
			return `(${compileAST(node.left)}${node.op}${compileAST(node.right)})`;
		case 'unary':
			return `(-${compileAST(node.operand)})`;
		case 'call': {
			const fn = MATH_FN_MAP[node.name];
			if (!fn) throw new Error(`Unknown function: ${node.name}`);
			return `${fn}(${node.args.map(compileAST).join(',')})`;
		}
	}
}

// ============================================
// Variable extractor
// ============================================

const STATE_VARS = new Set(['x', 'y', 'z']);

function collectIdents(node: ASTNode, out: Set<string>) {
	switch (node.type) {
		case 'ident':
			if (!STATE_VARS.has(node.name) && !MATH_FUNCTIONS.has(node.name)) {
				out.add(node.name);
			}
			break;
		case 'binary':
			collectIdents(node.left, out);
			collectIdents(node.right, out);
			break;
		case 'unary':
			collectIdents(node.operand, out);
			break;
		case 'call':
			for (const arg of node.args) collectIdents(arg, out);
			break;
	}
}

// ============================================
// DSL parser — top-level multiline text block
// ============================================

export interface ParseResult {
	error: string | null;
	derivative: DerivativeFn | null;
	paramNames: string[];
	paramDefaults: Record<string, number>;
}

const DERIVATIVE_RE = /^d([xyz])\s*=\s*(.+)$/;
const PARAM_RE = /^([a-zA-Z_]\w*)\s*=\s*([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)$/;

export function parseODEBlock(text: string): ParseResult {
	const lines = text.split('\n');
	const equations: Record<string, string> = {};
	const paramDefaults: Record<string, number> = {};

	// Pass 1: categorize lines
	for (const raw of lines) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;

		const derivMatch = line.match(DERIVATIVE_RE);
		if (derivMatch) {
			equations[derivMatch[1]] = derivMatch[2];
			continue;
		}

		const paramMatch = line.match(PARAM_RE);
		if (paramMatch) {
			paramDefaults[paramMatch[1]] = parseFloat(paramMatch[2]);
			continue;
		}

		return { error: `Unrecognized line: "${line}"`, derivative: null, paramNames: [], paramDefaults: {} };
	}

	// Validate we have all three equations
	for (const v of ['x', 'y', 'z'] as const) {
		if (!equations[v]) {
			return {
				error: `Missing equation for d${v}`,
				derivative: null,
				paramNames: [],
				paramDefaults: {},
			};
		}
	}

	// Pass 2: parse and compile each equation
	let dxJS: string, dyJS: string, dzJS: string;
	const allParams = new Set<string>();

	try {
		const dxAST = parseExpression(equations.x);
		const dyAST = parseExpression(equations.y);
		const dzAST = parseExpression(equations.z);

		collectIdents(dxAST, allParams);
		collectIdents(dyAST, allParams);
		collectIdents(dzAST, allParams);

		dxJS = compileAST(dxAST);
		dyJS = compileAST(dyAST);
		dzJS = compileAST(dzAST);
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		return { error: msg, derivative: null, paramNames: [], paramDefaults: {} };
	}

	// Build the compiled function
	const paramNames = [...allParams];
	const paramDestructure = paramNames.length > 0
		? `const {${paramNames.join(',')}} = p;`
		: '';

	const fnBody = `
		const [x,y,z] = s;
		${paramDestructure}
		return [${dxJS}, ${dyJS}, ${dzJS}];
	`;

	let derivative: DerivativeFn;
	try {
		derivative = new Function('s', 'p', fnBody) as DerivativeFn;
		// Quick sanity check — run once with dummy params
		const testParams: Record<string, number> = {};
		for (const name of paramNames) testParams[name] = paramDefaults[name] ?? 1;
		const result = derivative([1, 1, 1], testParams);
		if (!Array.isArray(result) || result.length !== 3) {
			return { error: 'Compiled function returned invalid result', derivative: null, paramNames: [], paramDefaults: {} };
		}
		for (const v of result) {
			if (typeof v !== 'number') {
				return { error: 'Compiled function returned non-number', derivative: null, paramNames: [], paramDefaults: {} };
			}
		}
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		return { error: `Compilation error: ${msg}`, derivative: null, paramNames: [], paramDefaults: {} };
	}

	return { error: null, derivative, paramNames, paramDefaults };
}
