$(document).ready(function(){
    console.log('Start loading Class Information......');
    $('div#Warrior').load('https://cdn.jsdelivr.net/gh/qiuzilay/Website-Code/Ability%20Tree/HTML/class/Warrior.html', function(){
        console.log('Warrior Loaded.');
    });
    $('div#Archer').load('https://cdn.jsdelivr.net/gh/qiuzilay/Website-Code/Ability%20Tree/HTML/class/Archer.html', function(){
        console.log('Archer Loaded.');
    });
    $('div#Mage').load('https://cdn.jsdelivr.net/gh/qiuzilay/Website-Code/Ability%20Tree/HTML/class/Mage.html', function(){
        console.log('Mage Loaded.');
    });
    $('div#Assassin').load('https://cdn.jsdelivr.net/gh/qiuzilay/Website-Code/Ability%20Tree/HTML/class/Assassin.html', function(){
        console.log('Assassin Loaded.');
    });
    $('div#Shaman').load('https://cdn.jsdelivr.net/gh/qiuzilay/Website-Code/Ability%20Tree/HTML/class/Shaman.html', function(){
        console.log('Shaman Loaded.');
    });
    

    console.log('Start loading Tooltip......');

    var all_button = $('button[data-name]');
    all_button.each(function(){
        let self = $(this);
        let get_dataName = $(this).data('name');
        let get_dataClass = $(this).closest('div.tabcontent').prop('id');
        let data_URL = "https://cdn.jsdelivr.net/gh/qiuzilay/Website-Code/Ability%20Tree/storage/tooltip/" + get_dataClass + "/" + get_dataName + ".txt";
        let tooltip_block = $(document.createElement('span')).addClass('tooltip');
        $(self).before(tooltip_block);
        $.ajax({
            url : data_URL,
            dataType: "text",
            success : function (data) {
                $(tooltip_block).html(data);
            }
        });
    });

    console.log('Finish loading all Tooltip.');
    console.log('Start converting color code......');

    /* 轉換樣式代碼至css */
    $(function(){
        var colorblock_creator = function(key){
            let CSScontent;
            switch (key) {
                case '0':
                    CSScontent = {"color":"#000000", "text-shadow": "2px 2px #000000"};
                    break;
                case '1':
                    CSScontent = {"color":"#0000AA", "text-shadow": "2px 2px #00002A"};
                    break;
                case '2':
                    CSScontent = {"color":"#00AA00", "text-shadow": "2px 2px #002A00"};
                    break;
                case '3':
                    CSScontent = {"color":"#00AAAA", "text-shadow": "2px 2px #002A2A"};
                    break;
                case '4':
                    CSScontent = {"color":"#AA0000", "text-shadow": "2px 2px #2A0000"};
                    break;
                case '5':
                    CSScontent = {"color":"#AA00AA", "text-shadow": "2px 2px #2A002A"};
                    break;
                case '6':
                    CSScontent = {"color":"#FFAA00", "text-shadow": "2px 2px #2A2A00"};
                    break;
                case '7':
                    CSScontent = {"color":"#AAAAAA", "text-shadow": "2px 2px #2A2A2A"};
                    break;
                case '8':
                    CSScontent = {"color":"#555555", "text-shadow": "2px 2px #151515"};
                    break;
                case '9':
                    CSScontent = {"color":"#5555FF", "text-shadow": "2px 2px #15153F"};
                    break;
                case 'a':
                    CSScontent = {"color":"#55FF55", "text-shadow": "2px 2px #153F15"};
                    break;
                case 'b':
                    CSScontent = {"color":"#55FFFF", "text-shadow": "2px 2px #153F3F"};
                    break;
                case 'c':
                    CSScontent = {"color":"#FF5555", "text-shadow": "2px 2px #3F1515"};
                    break;
                case 'd':
                    CSScontent = {"color":"#FF55FF", "text-shadow": "2px 2px #3F153F"};
                    break;
                case 'e':
                    CSScontent = {"color":"#FFFF55", "text-shadow": "2px 2px #3F3F15"};
                    break;
                case 'f':
                    CSScontent = {"color":"#FFFFFF", "text-shadow": "2px 2px #3F3F3F"};
                    break;
                case 'l':
                    CSScontent = {"font-weight":"900"};
                    break;
                case 'o':
                    CSScontent = {"font-style": "italic"};
                    break;
                case 'h':
                    CSScontent = {"font-size": "1.2em"};
                    break;
                default:
                    break;
            }
            let span_block;
            if (typeof CSScontent == 'undefined') {
                span_block = $(document.createElement('span'));
            }
            else {
                span_block = $(document.createElement('span')).css(CSScontent);
            }
            return span_block;
        };
        var colorpicker = function(index, codeblock, key_value, content_text){
            if (index < 1) {
                if (content_text == '') {
                    $(codeblock).append($(colorblock_creator(key_value)));
                    return false;
                }
                else {
                    $(codeblock).append(function(){return $(colorblock_creator(key_value)).text(content_text)});
                    return false;
                }
            }
            else {
                if (content_text == '') {
                    $(codeblock).children().wrap(function(){return $(colorblock_creator(key_value))});
                    return false;
                }
                else {
                    $(codeblock).children().wrap(function(){return $(colorblock_creator(key_value)).text(content_text)});
                    return false;
                }
            }
        };

        let re_step1 = new RegExp(/(?=\u00a7r)|(?=^\u00a7r)/, 'gum');
        let re_step2 = new RegExp(/(?=\u00a7)|(?=^\u00a7)/, 'gum');
        let all_tooltip = $('span.tooltip:contains(\u00a7)');
        //console.log('all_tooltip: ' + all_tooltip.get());
        all_tooltip.each(function(index1, first_step){
            let self = $(this);
            //console.log($(self).html() + ' [' + $.type($(self).html()) + ']');
            first_split = $(self).text().split(re_step1);
            let rebuild_data = $('<span></span>');
            $.each(first_split, function(index2, second_step){
                //console.log('子區塊內容: ' + $(rebuild_data).prop("outerHTML") + ' [' + $.type($(rebuild_data).prop("outerHTML")) + ']');
                //console.log('首次切割的第' + (index2+1) + '個區塊內容:\n' + second_step + ' [' + $.type(second_step) + ']');
                
                let split_string = second_step.split(re_step2).reverse();
                //console.log('區塊再次切割並反轉內容順序:\n' + split_string + ' [' +  $.type(split_string) + ']');
                
                let finalstep_returndata = $('<span style="color: unset; font-weight: unset; font-style: unset; font-shadow: unset;"></span>');
                $.each(split_string, function(index3, final_step){
                    //console.log('子區塊內容: ' + $(rebuild_data).prop("outerHTML") + ' [' + $.type($(rebuild_data).prop("outerHTML")) + ']');
                    //console.log('開始分析樣式代碼(' + (index3+1) + '):\n' + final_step + ' [' + $.type(final_step) + ']');
                    final_step = final_step.replace(/\u00a7/gum, '\u00a7');
                    let content = final_step;
                    let header = 'r';
                    //console.log('字串中是否有§符號: '+ final_step.includes('\u00a7'));
                    if (final_step.includes('\u00a7')) {
                        header = final_step[1];
                        content = final_step.substring(2);
                    }
                    //console.log('content(before): ' + content + ' [' + $.type(content) + ']');
                    //console.log('content_header: ' + header + ' [' + $.type(header) + ']');
                    
                    colorpicker(index3, finalstep_returndata, header, content);
                    
                    //console.log('content(after): ' + $(finalstep_returndata).prop("outerHTML") + ' [' + $.type($(finalstep_returndata).prop("outerHTML")) + ']');
                    //console.log('子區塊內容: ' + $(rebuild_data).prop("outerHTML") + ' [' + $.type($(rebuild_data).prop("outerHTML")) + ']');
                    //console.log('--------------------');
                    return;
                });
                //console.log('子區塊內容: ' + $(rebuild_data).prop("outerHTML") + ' [' + $.type($(rebuild_data).prop("outerHTML")) + ']');
                $(rebuild_data).append($(finalstep_returndata));
                //console.log('子區塊內容: ' + $(rebuild_data).prop("outerHTML") + ' [' + $.type($(rebuild_data).prop("outerHTML")) + ']');
                //console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
                return;
            });
            $(self).html($(rebuild_data));
            //console.log('最終結果: ' + $(self).prop("outerHTML") + ' [' + $.type($(self).prop("outerHTML")) + ']');
            return;
        });
        console.log('Finish converting all color codes.');
    });
});