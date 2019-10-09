function sort(isAsc, tree) {
    for (let node of tree.treeObject) {
        sortNodes(node);
    }

    function sortNodes(node) {
        node.children.sort(function (a, b) {
            if (a.title < b.title) {
                if (isAsc) {
                    return -1
                }
                return 1;
            }
            if (a.title > b.title) {
                if (isAsc) {
                    return 1
                }
                return -1;
            }
            return 0;
        });
        for (let child of node.children) {
            sortNodes(child);
        }
    }

    printTree(tree);
}