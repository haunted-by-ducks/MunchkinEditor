function getPagename(){
    // function that returns the name of the files to save
    // (this is the value/placeholder of the filename element)
    var filename = document.getElementById("filename");
    if(filename.value == ""){
        filename = filename.placeholder;
    }
    else {
        filename = filename.value;
    }
    return filename;
}

function loadPage(){
    // load the page from URL with GET parameters
    var url = new URL(document.URL);
    var params = url.searchParams;
    for(var pair of params.entries()){
        var key = pair[0];
        var val = pair[1];
        if(key.startsWith("card-")){
            var elem = document.getElementById(key);
            if(elem != null){
                elem.value = val;
            }
        }
    }
}

function savePage(){
    // create URL with GET parameters
    var params = [];
    var elems = document.querySelectorAll("*");
    console.log(elems);
    for(var elem of elems){
        if(elem.id.startsWith("card-")){
            params.push(elem.id + "=" + encodeURIComponent(elem.value));
        }
    }
    params = params.join("&");
    var path = document.URL.split("?")[0] + "?" + params;
    
    // save URL with GET parameters to executable file
    var text = '<script type="text\/javascript">window.location = "' + path + '";<\/script>';
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', getPagename() + ".html");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function saveJson() {
    const url = new URL(window.location);
    const settings = {
        'card-level': url.searchParams.get('card-level'),
        'card-type': url.searchParams.get('card-type'),
        'card-name': url.searchParams.get('card-name'),
        'card-mod': url.searchParams.get('card-mod'),
        'card-text1': url.searchParams.get('card-text1'),
        'card-text2': url.searchParams.get('card-text2'),
        'card-change': url.searchParams.get('card-change'),
        'card-left': url.searchParams.get('card-left'),
        'card-right': url.searchParams.get('card-right'),
        'card-background': url.searchParams.get('card-background'),
        'card-image': window.localStorage.getItem('card-image'),
        'card-x': url.searchParams.get('card-x'),
        'card-y': url.searchParams.get('card-y'),
        'card-s': url.searchParams.get('card-s'),
    };

    // save URL with GET parameters to executable file
    var text = JSON.stringify(settings);
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', getPagename() + ".json");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function loadJson() {
    var elem = document.getElementById("loadJson");
    var files = elem.files;
    if(files.length > 0){
        var file = files[0];
        var reader = new FileReader();
        reader.onloadend = function(){
            var result = atob(reader.result.split(',')[1]);

            if (!result) {
                return;
            }

            console.log('result', result);

            var settings = JSON.parse(result);

            const url = new URL(window.location);
            url.searchParams.set('card-level', settings['card-level']);
            url.searchParams.set('card-type', settings['card-type']);
            url.searchParams.set('card-name', settings['card-name']);
            url.searchParams.set('card-mod', settings['card-mod']);
            url.searchParams.set('card-text1', settings['card-text1']);
            url.searchParams.set('card-text2', settings['card-text2']);
            url.searchParams.set('card-change', settings['card-change']);
            url.searchParams.set('card-left', settings['card-left']);
            url.searchParams.set('card-right', settings['card-right']);
            url.searchParams.set('card-background', settings['card-background']);
            window.localStorage.setItem('card-image', settings['card-image']);
            url.searchParams.set('card-x', settings['card-x']);
            url.searchParams.set('card-y', settings['card-y']);
            url.searchParams.set('card-s', settings['card-s']);

            window.history.pushState({}, '', url);

            loadPage();
            drawImage();
        }
        reader.readAsDataURL(file);
    }
}

function updateIcon(){
    var elem = document.getElementById("card-background");
    if(elem.value.codePointAt(0) == 128682){
        // update icon and placeholders from treasure cards to door cards
        elem.value = String.fromCodePoint(129520);
        document.getElementById("card-level").placeholder = "Bonus";
        document.getElementById("card-type").placeholder = "Usable by";
        document.getElementById("card-mod").placeholder = "";
        document.getElementById("card-text1").placeholder = "Text 1";
        document.getElementById("card-text2").placeholder = "Text 2";
        document.getElementById("card-left").placeholder = "Hands";
        document.getElementById("card-right").placeholder = "Value";
    }
    else {
        // update icon and placeholders from door cards to treasure cards
        elem.value = String.fromCodePoint(128682);
        document.getElementById("card-level").placeholder = "Level";
        document.getElementById("card-type").placeholder = "Type";
        document.getElementById("card-mod").placeholder = "[Modify Monster]";
        document.getElementById("card-text1").placeholder = "Text";
        document.getElementById("card-text2").placeholder = "Bad Stuff";
        document.getElementById("card-left").placeholder = "Levels";
        document.getElementById("card-right").placeholder = "Treasures";
    }
}

function addImage(ctx, elem, w, h, x, y, s){
    // function that places the main image of the card
    var base64Image = window.localStorage.getItem('card-image');
    if (!base64Image) {
        return
    }

    const image = new Image();
    image.src = base64Image;
    
    var imgW = Math.round(s*w);
    var imgH = Math.round(s*w*image.naturalHeight/image.naturalWidth);
    ctx.drawImage(image, (w-imgW)/2+Math.round(x*w/100.0), (h-imgH)/2+Math.round(y*h/100.0), imgW, imgH);
}

function loadImage() {
    // function that loads the image from the file input and puts it in to localstate
    var elem = document.getElementById("card-image");
    var files = elem.files;
    if(files.length > 0){
        var file = files[0];
        var reader = new FileReader();
        reader.onloadend = function(){
            var result = reader.result;

            window.localStorage.setItem('card-image', result);
        }
        reader.readAsDataURL(file);
    }
}

function convertFontSize(s){
    // convert font size to pixel size with respect to resolution
    var canvas = document.getElementById("canvas");
    return Math.round(1.0 * parseInt(canvas.width) / (parseInt(canvas.style.width.replaceAll("mm")) * 3.7795275591) * s).toString();
}

function handleSpecialChars(val){
    // handle special characters for Quasimodo font
    val = val.replaceAll("\u00e4", "\u00c4"); // ae -> AE
    val = val.replaceAll("\u00f6", "\u00d6"); // oe -> OE
    val = val.replaceAll("\u00fc", "\u00dc"); // ue -> UE
    val = val.replaceAll("\u00df", "\u1e9e"); // ss -> SS
    return val;
}

function addQuasimodoText(ctx, val, fontsize, w, start_h, space, add_space){
    // function that adds title text to the canvas
    val = handleSpecialChars(val);
    ctx.textAlign = "center";
    ctx.font = convertFontSize(fontsize) + "pt Quasimodo";
    var lines = val.split("#");
    var newline = 1.1*convertFontSize(fontsize)*1.33;
    if(space > 0){
        space = add_space;
    }
    else if(space < 0){
        space = -newline*(lines.length-1);
    }
    for(var i = 0; i < lines.length; ++i){
        lines[i] = handleSpecialChars(lines[i])
        ctx.fillText(lines[i], 0.5*w, start_h+space+newline*i, 0.9*w);
    }
    add_space += newline*(lines.length-1);
    return add_space;
}

function addCaslonAntiqueText(ctx, val, fontsize, w, start_h, space, add_space){
    // function that adds description text to the canvas
    var bi = "";
    if(val.endsWith("**")){
        bi = "bold ";
        val = val.substring(0, val.length-2);
    }
    if(val.endsWith("*")){
        bi = "italic " + bi;
        val = val.substring(0, val.length-1);
    }
    ctx.textAlign = "left";
    ctx.font = bi + convertFontSize(fontsize) + "pt CaslonAntique";
    var lines = ("   " + val).replaceAll("\r", "").replaceAll("\n\n", "\n\n   ").split("\n");
    var newline = 1.08*convertFontSize(fontsize)*1.33;
    if(space > 0){
        space = add_space;
    }
    else if(space < 0){
        space = -newline*(lines.length-1);
    }
    for(var i = 0; i < lines.length; ++i){
        ctx.fillText(lines[i], 0.1*w, start_h+space+newline*i);
    }
    add_space += newline*(lines.length-1);
    return add_space;
}

function drawImage(){
    const url = new URL(window.location);
    var canvas = document.getElementById("canvas");
    var w = canvas.width;
    var h = canvas.height;
    var ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "#270b00";
    
    var add_space = 0;

    // background image
    var val = document.getElementById("card-background").value;
    var img = new Image();
    if(val.codePointAt(0) == 128682){
        // door card
        img.src = "data:image/png;base64,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";
    }
    else {
        // treasure card
        img.src = "data:image/png;base64,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";
    }
    ctx.drawImage(img, 0, 0, w, h);
    
    // main image
    var elem = document.getElementById("card-image");
    var x = url.searchParams.get('card-x') || 0;
    var y = url.searchParams.get('card-y') || 0;
    var s = url.searchParams.get('card-s') || 75;
    console.log(x, y, s);
    addImage(ctx, elem, w, h, parseInt(x), parseInt(y), parseInt(s)/100.0);
    
    // level
    var val = document.getElementById("card-level").value;
    ctx.textAlign = "center";
    ctx.font = convertFontSize(10) + "pt Quasimodo";
    ctx.fillText(val, 0.5*w, 0.1*h);
    if(val == ""){
        add_space -= 0.04*h;
    }
    
    // type
    var val = document.getElementById("card-type").value;
    ctx.textAlign = "center";
    ctx.font = convertFontSize(9) + "pt CaslonAntique";
    ctx.fillText(val, 0.5*w, 0.14*h+add_space);
    if(val == "" && add_space < 0){
        add_space -= 0.06*h;
    }
    
    // name
    var val = document.getElementById("card-name").value;
    add_space = addQuasimodoText(ctx, val, 12, w, 0.2*h, 1, add_space);
    if(val != ""){
        // prepare filename
        val = val.replace(/[^\x00-\x7F]/g, "x");
        val = val.replace(/[\.\?\!\;\,]/g, "");
        val = val.replaceAll(" ", "_");
        val = val.replace(/-#([A-Z])/g, "-\$1").replace(/-#([a-z])/g, "\$1");
        val = val.replaceAll("#", "_");
        document.getElementById("filename").placeholder = val;
    }
    
    // modify monster
    var val = document.getElementById("card-mod").value;
    add_space = addQuasimodoText(ctx, val, 11, w, 0.3*h, 1, add_space);
    if(val != ""){
        add_space += 2.1*convertFontSize(11)*1.33;
    }
    
    // text 1
    var val = document.getElementById("card-text1").value;
    add_space = addCaslonAntiqueText(ctx, val, 9, w, 0.27*h, 1, add_space);
    
    // text 2
    var val = document.getElementById("card-text2").value;
    add_space = addCaslonAntiqueText(ctx, val, 9, w, 0.89*h, -1, add_space);
    
    // change a level
    var val = document.getElementById("card-change").value;
    add_space = addQuasimodoText(ctx, val, 11, w, 0.9*h, -1, add_space);
    
    // bottom left
    var val = document.getElementById("card-left").value;
    ctx.textAlign = "left";
    ctx.font = convertFontSize(9) + "pt CaslonAntique";
    ctx.fillText(val, 0.125*w, 0.95*h);
    
    // bottom right
    var val = document.getElementById("card-right").value;
    ctx.textAlign = "right";
    ctx.font = convertFontSize(9) + "pt CaslonAntique";
    ctx.fillText(val, 0.875*w, 0.95*h);
    
}

function downloadImage(){
    // get canvas
    var canvas = document.getElementById("canvas");
    
    // create image file for download
    var element = document.createElement('a');
    element.setAttribute("download", getPagename() + ".png");
    element.setAttribute("href", canvas.toDataURL("image/png").replaceAll("image/png", "image/octet-stream"));
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // save the page as well
    // savePage();

    // save settings
    saveJson();
}

loadPage();
drawImage();

document.querySelector('#download').addEventListener('click', downloadImage);
document.querySelector('#card-background').addEventListener('click', () => {
    updateIcon();
    drawImage();
});
document.querySelector('#card-level').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-level', document.querySelector('#card-level').value);
    window.history.pushState({}, '', url);
    
    drawImage();
});
document.querySelector('#card-type').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-type', document.querySelector('#card-type').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-name').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-name', document.querySelector('#card-name').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-mod').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-mod', document.querySelector('#card-mod').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-text1').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-text1', document.querySelector('#card-text1').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-text2').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-text2', document.querySelector('#card-text2').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-change').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-change', document.querySelector('#card-change').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-left').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-left', document.querySelector('#card-left').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-right').addEventListener('keyup', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-right', document.querySelector('#card-right').value);
    window.history.pushState({}, '', url);

    drawImage()
});

document.querySelector('#card-x').addEventListener('change', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-x', document.querySelector('#card-x').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-y').addEventListener('change', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-y', document.querySelector('#card-y').value);
    window.history.pushState({}, '', url);

    drawImage()
});
document.querySelector('#card-s').addEventListener('change', () => {
    const url = new URL(window.location);
    url.searchParams.set('card-s', document.querySelector('#card-s').value);
    window.history.pushState({}, '', url);

    drawImage()
});

document.querySelector('#card-image').addEventListener('change', loadImage);

document.querySelector('#loadJson').addEventListener('change', loadJson);
