class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
// convert input array to binary tree node structure
const arrayToBinaryTree = (arr) => {
  if (arr.length === 0) return null;

  const root = new Node(arr[0]);
  const queue = [root];

  for (let i = 1; i < arr.length; i += 2) {
    const current = queue.shift();

    if (arr[i] !== null) {
      current.left = new Node(arr[i]);
      queue.push(current.left);
    }

    if (i + 1 < arr.length && arr[i + 1] !== null) {
      current.right = new Node(arr[i + 1]);
      queue.push(current.right);
    }
  }

  return root;
};
  // invert the binary tree
const invertBinaryTree = (root) => {
  if (!root) {
    return null;
  }

  const queue = [root];

  while (queue.length > 0) {
    const current = queue.shift();
    // swap the left and right nodes
    [current.left, current.right] = [current.right, current.left];
    // if the sub node exists, push into queue to invert
    if (current.left) {
      queue.push(current.left);
    }
    if (current.right) {
      queue.push(current.right);
    }
  }

  return root;
};
  // convert the binary tree structure into flat arrays
const binaryTreeToArray = (root, maxDepth) => {
  if (!root) {
    return [];
  }

  const array = [];
  const queue = [{ node: root, depth: 1 }];

  while (queue.length > 0) {
    const { node, depth } = queue.shift();
    array.push({ value: node?.value, depth });
    if (node?.left) {
      queue.push({ node: node.left, depth: depth + 1 });
    } else if (depth === maxDepth) {
      queue.push({ node: null, depth: depth + 1 });
    }
    if (node?.right) {
      queue.push({ node: node.right, depth: depth + 1 });
    } else if (depth === maxDepth) {
      queue.push({ node: null, depth: depth + 1 });
    }
  }

  return array.map((item) => item.value ?? null);
};

const inputTest = async () => {
  const inputs = [
    [5, 3, 8, 1, 7, 2, 6],
    [6, 8, 9],
    [5, 3, 8, 1, 7, 2, 6, 100, 3, -1],
    [],
  ];
  inputs.forEach((input) => {
    const maxDepth = Math.floor(Math.log2(input.length));
    const tree = arrayToBinaryTree(input);
    const invertTree = invertBinaryTree(tree);
    const output = binaryTreeToArray(invertTree, maxDepth);
    console.log('input:', input);
    console.log('output:', output);
  });
};

inputTest();
