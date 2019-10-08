async function getData() {
    const response = await fetch('https://raw.githubusercontent.com/wrike/frontend-test/master/data.json');
    return await response.json();
}


async function buildTree() {
    let data = await getData();
    return new Tree(data);
}


function Tree(data) {
    this.nodeID = new Map();
    for (let elem of data) {
        this.nodeID.set(elem.id, {
            id: elem.id, title: elem.title,
            parentId: elem.parentId, children: []
        });
    }

    const setNodes = new Set();
    const stack = (function () {
        const array = [];
        return {
            add: function (elem) {
                array.push(elem)
            },
            get: function () {
                return array.pop();
            },
            isEmpty: function () {
                return array.length === 0;
            }
        }
    })();

    this.treeObject = [];

    for (let id of this.nodeID.keys()) {

        if (!setNodes.has(id)) {
            let elem = this.nodeID.get(id);
            stack.add(elem);
            let parentId = elem.parentId;
            while (!setNodes.has(parentId) && parentId !== null) {
                let parent = this.nodeID.get(parentId);
                parentId = parent.parentId;
                stack.add(parent)
            }
            if (parentId === null) {
                let stackElem = stack.get();
                this.treeObject.push(stackElem);
                setNodes.add(stackElem.id);
            }
            while (!stack.isEmpty()) {
                let stackElem = stack.get();
                this.nodeID.get(stackElem.parentId).children.push(stackElem);
                setNodes.add(stackElem.id);
            }
        }
    }
}

async function printTree() {
    let tree = await buildTree();
    for (let node of tree.treeObject) {
        dfs(node, 'node')
    }

    function dfs(node, id) {

        let classNameInternal = 'node__internal';
        let classNameLeaf = 'node__leaf';
        let classid = '' + node.id;
        let triangle = document.createElement('span');
        let nodeElement = document.createElement('div');
        nodeElement.id = node.id;
        if(node.children.length !== 0) {
            triangle.classList.add("fas", "fa-caret-down", classid);
            triangle.onclick = function hideAndShowChildElements() {
                let children = document.getElementById(classid).children;
                if (document.getElementById(classid).querySelector('.node-hide') !== null) {
                    // .. it exists
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.remove("node-hide");
                    }
                } else {
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.add("node-hide");
                    }
                }
            };
            triangle.innerHTML = node.title;
        } else {
            nodeElement.classList.add(classNameLeaf);
            nodeElement.innerHTML = node.title;
        }
        document.getElementById(id).appendChild(triangle);

        document.getElementById(id).appendChild(nodeElement);

        for (let child of node.children) {
            nodeElement.classList.add(classNameInternal);
            dfs(child, node.id);
        }
    }
}

printTree();