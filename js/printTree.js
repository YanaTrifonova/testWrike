 function printTree(tree) {
    const containerId = 'node';
    document.getElementById(containerId).innerHTML = '';
    for (let node of tree.treeObject) {
        dfs(node, containerId);
    }

    function dfs(node, id) {
        const classNameInternal = 'node__internal';
        const classNameLeaf = 'node__leaf';
        const classNameText = 'node__internal__text';
        const classID = getClassId(node);
        const triangle = document.createElement('span');
        const text = document.createElement('span');
        const nodeElement = document.createElement('div');
        const triangleAndText = document.createElement('div');
        triangleAndText.id =  getTriangleAndTextId(node);
        nodeElement.id = node.id;
        if (node.children.length !== 0) {
            triangle.classList.add("fas", "fa-caret-down", classID);
            triangleAndText.onclick = function hideAndShowChildElements() {
                const currentElem = document.getElementById(classID);
                const children = currentElem.children;
                const isHidden = Array.prototype.slice.apply(children).every(e =>
                    e.className.indexOf(getHideCls()) !== -1);
                if (isHidden) {
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.remove(getHideCls());
                        node.isHidden = false;
                    }
                    document.getElementsByClassName(classID)[0].classList.remove(getRotateCls());
                } else {
                    for (let i = 0; i < children.length; i++) {
                        children[i].classList.add(getHideCls());
                        node.isHidden = true;
                    }
                    document.getElementsByClassName(classID)[0].classList.add(getRotateCls());
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
        const currentElem = document.getElementById(classID);
        const children = currentElem.children;
        if (!node.isHidden) {
            for (let i = 0; i < children.length; i++) {
                children[i].classList.remove(getHideCls());
            }
        } else {
            for (let i = 0; i < children.length; i++) {
                children[i].classList.add(getHideCls());
            }
            document.getElementsByClassName(classID)[0].classList.add(getRotateCls());
        }
    }
}
