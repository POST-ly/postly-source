function createBinaryNode(tabId) {
    return `
        <div style="padding: 4px 0;">
            <input type="file" id="${tabId}BinaryBody" onchange="return setBinaryValue(event)" />
        </div>
    `
}

function setBinaryValue(event) {

}

function getBinaryValue(cb) {
    var files = postData[`${currentTab}BinaryBody`]
    var reader = new FileReader()
    reader.onload = function(e) {
        var res = e.target.result
        return res
    }
    reader.readAsDataURL(files.files[0])  
}