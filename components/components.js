
wuObject.registerComponent({
    "componentName": "computerBox",
    "HTML": `
            <ul class="panel" data-list="computers">
            <li class="row">
                <p class="notif_title">--state--</p>
                <p class="notif_desc">--city--</p>
                
            </li>
                            
    </ul>`
});

wuObject.registerComponent({
    "componentName": "priceBox",
    "HTML": `<div class="panel" data-list="cars">
            <div class="row">
                    <h2 contenteditable="true" class="dark_title">--name--</h2>
                    <p>--price--</p>
            </div>

</div>`
});


wuObject.registerComponent({
    "componentName": "newsBox",
    "HTML": `<div class="panel" data-list="news">
            <div class="row">
                    <h2 class="light_title">--headline--</h2>
                    <p>--content--</p>
                    
            </div>

</div>`
});


wuObject.registerComponent({
        "componentName": "randomBox",
        "HTML": `<div class="panel">
                <div class="row">
                        <h2 class="light_title">Big News from YYZ</h2>
                        <p>Visit your office now.</p>
                        
                </div>
    
    </div>`
});

wuObject.registerComponent({
        "componentName": "scoreBox",
        "HTML": `<div class="panel">
                <div class="row">
                        <h2 class="light_title">Score is 101</h2>
                        <p>Click to see full scoreboard.</p>
                        
                </div>
    
    </div>`
});

wuObject.registerComponent({
        "componentName": "arrayBox",
        "HTML": `<div class="panel" data-list="arrayList">
                <div class="row">
                        <p>--item--</p>                       
                </div>
    
    </div>`
});
