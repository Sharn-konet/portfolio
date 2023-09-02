export default {
  "nodes": [
    {
      "id": "Python",
      "group": 1
    },
    {
      "id": "Rust",
      "group": 1
    },
    {
      "id": "Julia",
      "group": 1
    },
    {
      "id": "Svelte",
      "group": 1
    },
    {
      "id": "AWS",
      "group": 2
    },
    {
      "id": "Snowflake",
      "group": 2
    }
  ],
  "links": [
    {
      "source": "Python",
      "target": "Snowflake",
      "value": 3
    },
    {
      "source": "Python",
      "target": "AWS",
      "value": 9
    },
    {
      "source": "Julia",
      "target": "Python",
      "value": 2
    },
    {
      "source": "Rust",
      "target": "Svelte",
      "value": 4
    },
  ]
};
