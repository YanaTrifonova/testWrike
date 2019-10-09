async function buildAndPrintTree() {
    const data = await getData();
    const tree = new Tree(data);
    document.getElementById("ascending").addEventListener("click", function () {
        sort(true, tree)
    });
    document.getElementById("descending").addEventListener("click", function () {
        sort(false, tree)
    });
    document.getElementById("searchInput").addEventListener("keydown", function () {
        search(tree)
    });
    printTree(tree);
}


buildAndPrintTree();