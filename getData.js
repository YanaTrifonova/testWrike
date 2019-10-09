async function getData() {
    const response = await fetch('https://raw.githubusercontent.com/wrike/frontend-test/master/data.json');
    return await response.json();
}


async function buildTree() {
    let data = await getData();

    // let data = [
    //     {
    //         "id":2,
    //         "title":"Folder 1",
    //         "parentId":-1
    //     },
    //     {
    //         "id":3,
    //         "title":"abc",
    //         "parentId":1
    //     },
    //     {
    //         "id":-1,
    //         "title":"Folder 2",
    //         "parentId":null
    //     },
    //     {
    //         "id":1,
    //         "title":"Folder 2",
    //         "parentId":-1
    //     },
    //     {
    //         "id":4,
    //         "title":"Wrike",
    //         "parentId":2
    //     },
    //     {
    //         "id":5,
    //         "title":"cde",
    //         "parentId":1
    //     }
    // ];


    //save our tree as an object of the window
    window.tree = new Tree(data);
    //to have an ability to use it without binding
    return window.tree;
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

async function printTree(treeOrig) {
    let tree;
    if (treeOrig === undefined) {
        tree = await buildTree();
    } else {
        tree = treeOrig;
    }
    const containerId = 'node';
    document.getElementById(containerId).innerHTML = '';
    for (let node of tree.treeObject) {
        dfs(node, containerId);
    }

    function dfs(node, id) {
        const classNameInternal = 'node__internal';
        const classNameLeaf = 'node__leaf';
        const classNameText = 'node__internal__text';
        const classid = '' + node.id;
        const triangleAndTextID = 'node' + node.id;
        const triangle = document.createElement('span');
        const text = document.createElement('span');
        const nodeElement = document.createElement('div');
        const triangleAndText = document.createElement('div');
        triangleAndText.id = triangleAndTextID;
        nodeElement.id = node.id;
        if (node.children.length !== 0) {
            triangle.classList.add("fas", "fa-caret-down", classid);
            triangleAndText.onclick = function hideAndShowChildElements() {
                const currentElem = document.getElementById(classid);
                const children = currentElem.children;
                const hasHide = Array.prototype.slice.apply(children).every(e => e.className.indexOf("node-hide") !== -1);
                if (hasHide) {
                    // .. it exists
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.remove("node-hide");
                    }
                    document.getElementsByClassName(classid)[0].classList.remove('node-rotate');
                } else {
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.add("node-hide");
                    }
                    document.getElementsByClassName(classid)[0].classList.add('node-rotate');
                }
            };

            text.innerHTML = node.title;
            text.classList.add(classNameText);
        } else {
            triangleAndText.classList.add(classNameLeaf);
            text.innerHTML = node.title;
        }

        document.getElementById(id).appendChild(triangleAndText);
        triangleAndText.appendChild(triangle);
        triangleAndText.appendChild(text);
        document.getElementById(id).appendChild(nodeElement);

        for (let child of node.children) {
            nodeElement.classList.add(classNameInternal);
            dfs(child, node.id);
        }
    }
}

printTree(undefined);

function sort(param) {
    let tree = window.tree;
    for (let node of tree.treeObject) {
        sortNodes(node);
    }

    function sortNodes(node) {
        node.children.sort(function (a, b) {
            if (a.title < b.title) {
                if (param) {
                    return -1
                } else return 1;
            }
            if (a.title > b.title) {
                if (param) {
                    return 1
                } else return -1;
            }
            return 0;
        });
        for (let i = 0; i < node.children.length; i++) {
            sortNodes(node.children[i]);
        }
    }

    printTree(tree);
}

function search(e) {
    if (window.timeout !== undefined) {
        clearTimeout(window.timeout)
    }
    window.timeout = setTimeout(function() {
        let hiddenBySearch = document.getElementsByClassName('node-hiddenBySearch');
        while (hiddenBySearch.length !== 0) {
            hiddenBySearch[0].classList.remove('node-hiddenBySearch');
        }
        let input = document.querySelector("#searchInput").value;
        for (let node of window.tree.treeObject) {
            dfs(node, input);
        }
    }, 100);

    function dfs(node, input) {
        let anyFound = false;
        for (let i = 0; i < node.children.length; i++) {
            let isFound = dfs(node.children[i], input);
            if (isFound) {
                anyFound = true;
            }
        }

        let tempTitle = node.title.toLowerCase();
        let tempInput = input.toLowerCase();

        if (tempTitle.indexOf(tempInput) === -1 && !anyFound) {
            document.getElementById('node' + node.id).classList.add('node-hiddenBySearch');
            return false;
        } else return true;
    }
}
