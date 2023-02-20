function mergeSort(array) {
  if (array.length === 1) return array;
  if (array.length === 2)
    return array[0] > array[1] ? [array[1], array[0]] : [array[0], array[1]];
  const firstHalf = array.slice(0, Math.floor(array.length / 2));
  const secondHalf = array.slice(firstHalf.length, array.length);
  const sortedFirstHalf = mergeSort(firstHalf);
  const sortedSecondHalf = mergeSort(secondHalf);
  const mergedList = [];
  while (sortedFirstHalf.length > 0 && sortedSecondHalf.length > 0) {
    sortedFirstHalf[0] > sortedSecondHalf[0]
      ? mergedList.push(sortedSecondHalf.splice(0, 1)[0])
      : mergedList.push(sortedFirstHalf.splice(0, 1)[0]);
  }
  mergedList.push(...sortedFirstHalf, ...sortedSecondHalf);
  return mergedList;
}

function removeDuplicates(sortedArray, newArray = []) {
  for (let i = 0; i < sortedArray.length; i++) {
    if (sortedArray[i] !== sortedArray[i + 1]) newArray.push(sortedArray[i]);
  }
  return newArray;
}

function buildTree(array) {
  // array must be sorted and duplicates must be removed
  if (array.length === 0) return null;
  const start = 0;
  const end = array.length;
  const mid = Math.floor((end - start) / 2);
  const left = array.slice(0, mid);
  const right = array.slice(mid + 1, end);
  const node = new Node(array[mid], buildTree(left), buildTree(right));
  return node;
}

class Node {
  constructor(data, left, right) {
    this._data = data;
    this._left = left;
    this._right = right;
  }

  get data() {
    return this._data;
  }

  set data(newData) {
    this._data = newData;
  }

  get right() {
    return this._right;
  }

  set right(value) {
    this._right = value;
  }

  get left() {
    return this._left;
  }

  set left(value) {
    this._left = value;
  }
}

class Tree {
  constructor(array) {
    this.root = buildTree(removeDuplicates(mergeSort(array)));
  }

  prettyPrint(node = this.root, prefix = '', isLeft = true) {
    if (node.right !== null)
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? '│   ' : '    '}`,
        false
      );
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null)
      this.prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }

  contains(value, node = this.root) {
    if (node === null) return false;
    if (node.data === value) return true;
    return node.data > value
      ? this.contains(value, node.left)
      : this.contains(value, node.right);
  }

  insert(value, node = this.root) {
    if (!this.contains(value)) {
      if (node.right === null && node.data < value)
        node.right = new Node(value, null, null);
      else if (node.left === null && node.data > value)
        node.left = new Node(value, null, null);
      else {
        node.data > value
          ? this.insert(value, node.left)
          : this.insert(value, node.right);
      }
    }
  }

  find(value, node = this.root) {
    if (node === null) return undefined;
    if (node.data === value) return node;
    return node.data > value
      ? this.find(value, node.left)
      : this.find(value, node.right);
  }

  countChild(node) {
    if (node.left === null && node.right === null) return 0;
    if (node.left === null || node.right === null) return 1;
    return 2;
  }

  parentNode(child, node = this.root) {
    if ((node.left === null && node.right === null) || child === this.root)
      return undefined;
    if (node.left === child || node.right === child) return node;
    return node.data > child.data
      ? this.parentNode(child, node.left)
      : this.parentNode(child, node.right);
  }

  findTheSmallestOfTheHighest(node, start = node.right) {
    if (start.left === null) return start;
    return this.findTheSmallestOfTheHighest(node, start.left);
  }

  delete(value) {
    const node = this.find(value);
    const parent = this.parentNode(node);
    if (this.countChild(node) === 0)
      parent.data > node.data ? (parent.left = null) : (parent.right = null);
    else if (this.countChild(node) === 1) {
      let newChild;
      node.left === null ? (newChild = node.right) : (newChild = node.left);
      parent.data > newChild.data
        ? (parent.left = newChild)
        : (parent.right = newChild);
    } else {
      const replacementNode = this.findTheSmallestOfTheHighest(node);
      const replacementData = replacementNode.data;
      this.delete(replacementData);
      node.data = replacementData;
    }
  }
}

const arr = [1, 2, 3, 4, 8, 9, 11];
const tree = new Tree(arr);
tree.prettyPrint();
