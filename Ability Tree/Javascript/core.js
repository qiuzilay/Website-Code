$(document).ready(function() {
    console.log('JQuery Loaded Successfully!');
    $(this).scrollTop(0);

    /* 防止所有按鈕出現右鍵選單 */
    $('button').bind('contextmenu', function(){
        return false;
    });
    
    var all_button = $('button[data-last][data-next]');
    var all_img = $('img[data-last][data-next]');
    var path_checker = function(current_data_name, brother_button) {
        let relateImg = all_img.filter(function(index, img) {
            return $(img).data('last').includes(current_data_name) || $(img).data('next').includes(current_data_name);
        });
        let relateButton = all_button.filter(function(index, button) {
            return $(button).data('last').includes(current_data_name) || $(button).data('next').includes(current_data_name) || $(button).data('name').includes(current_data_name) || ($.inArray($(button).data('name').toString(), brother_button) != -1 );
        });

        let relateButtonlist = [];
        $(relateButton).each(function() {
            if ($(this).hasClass('enable')) {
                relateButtonlist.push($(this).data('name'));
            }
        });

        let arraylist = $(relateButtonlist).toArray();
        
        console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n觸發按鈕: ' + current_data_name + '\n附近啟動狀態的按鈕: ' + arraylist +'\n\n同輩按鈕: '+ brother_button +'\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        
        $(relateImg).each(function() {
            let owo = $(this);
            console.log('窩的名字: '+ $(owo).attr('class'));
            console.log('窩連接的上一個按鈕: '+$(owo).data('last')+' [type: '+$.type($(owo).data('last'))+']');
            console.log('窩連接的下一個按鈕: '+$(owo).data('next')+' [type: '+$.type($(owo).data('last'))+']');
            console.log('--------------------');
            let owo_last = $(owo).data('last');
            let last_boolean;
            $(owo_last).each(function(owo_index, head_button) {
                if ($.inArray(head_button, arraylist) != -1) {
                    last_boolean = true;
                    console.log('檢查頭: '+head_button+' ['+last_boolean+']');
                }
                else {
                    last_boolean = false;
                    console.log('檢查頭: '+head_button+' ['+last_boolean+']');
                    return false;
                }
            });

            let owo_next = $(owo).data('next');
            let next_boolean;
            $(owo_next).each(function(owo_index, end_button) {
                if ($.inArray(end_button, arraylist) != -1) {
                    next_boolean = true;
                    console.log('檢查尾: '+end_button+' ['+next_boolean+']');
                    return false;
                }
                else {
                    next_boolean = false;
                    console.log('檢查尾: '+end_button+' ['+next_boolean+']');
                }
            });

            
            console.log('頭最終結果: '+last_boolean);
            console.log('尾最終結果: '+next_boolean);
            if ((last_boolean == true) && (next_boolean == true)) {
                owo.addClass('active');
                console.log('狀態: 激活啦\n==============================');
            }
            else {
                owo.removeClass('active');
                console.log('狀態: 關掉啦\n==============================');
            }
        });

        console.log('Path checked complected.');
        console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        return false;
    }

    var lastbutton_of_terminal_checker = function(termianlbutton, termianlbutton_name) {
        let result = true;
        all_button.filter(function(){return $(this).data('next').includes(termianlbutton_name);}).each(function() {
            if ($(this).hasClass('enable')) {
                //console.log('齁齁抓到 '+ $(this).data('name') +' !');
                result = false;
                return false;
            }
        });
        return result;
    }

    /* Enable */
    $('.containerslot button').click(function(){
        let AP_left = parseInt($(this).closest('div.tabcontent').find('span[data-type="AP_pool"]').text());
        let AP_cost = parseInt($(this).data('cost'));
        let data_name = $(this).data('name');
        let data_last = $(this).data('last');
        let data_next = $(this).data('next');
        let data_req = $(this).data('req');
        let data_type_req = $(this).data('type-req');
        let data_type_req_min = parseInt($(this).data('type-req-min'));
        let data_archetype = $(this).closest('div.tabcontent').find('span[data-type]');
        let data_disrelative = $(this).data('disrelative');
        let self = $(this);
        let req_archetype;
        if ($(this).hasClass('toggle') == true) {
            if (AP_left < AP_cost) {
                console.log('技能點不足!');
                return false;
            }
            //console.log('data-req: '+data_req);
            //console.log('data-cost: '+AP_cost);
            //console.log('AP-left: '+AP_left);
            if (typeof data_req !== 'undefined') {
                let req_ability = all_button.filter(function(){return $(this).data('name') == data_req;});
                if (req_ability.hasClass('enable') == false) {
                    console.log('您沒有 <'+ data_req +'> 這個技能!');
                    return false;
                }
            }
            if (typeof data_type_req !== 'undefined') {
                req_archetype = data_archetype.filter(function(){return $(this).data('type') == data_type_req;});
                //console.log('data_archetype: '+data_archetype+'\nreq_archetype: '+req_archetype.data('type'));
                if (parseInt(req_archetype.text()) < data_type_req_min) {
                    console.log('您的 ['+ data_type_req +' Archetype] 的點數不足!');
                    return false;
                }
            }
            if ($(this).hasClass('disable') == true) {
                $(this).addClass('enable');
                $(this).removeClass('disable');
                //console.log('Enable Ability.');
                $(function(){
                    let bro_buttonlist = [];
                    /* 在此技能之後且互相連接的技能允許點擊*/
                    $.each(data_next, function (index, name) {
                        let next_button = $('button[data-name="' + name + '"]');
                        //console.log(name+' 是reverse? :['+(next_button.data('info') == 'reverse')+'], 是enable狀態? :['+(next_button.hasClass('enable'))+']');
                        if ((next_button.data('info') == 'reverse') && (next_button.hasClass('enable'))) {
                            next_button.removeClass('toggle');
                        }
                        else {
                            next_button.addClass('toggle');
                        }
                    });
                    $.each(data_last, function (index, name) {
                        let last_button = $('button[data-name="' + name + '"]');
                        if (last_button.hasClass('enable') == true) {
                            /* 在此此技能之前且互相連接而且又是enable狀態的技能禁止點擊*/
                            last_button.removeClass('toggle');

                            if (last_button.data('info') == 'lock') {
                                //console.log('Lock Successfully.');
                                all_button.filter(function (index, button) {return $(button).data('last').includes(name);}).not(self).removeClass('toggle');
                            }

                            /* 拿到上一個Enable狀態中的Button所持有其之後連接的Button名字列表並篩選出Enable狀態的按鈕清單給path_checker用 */
                            $.merge(bro_buttonlist, $(last_button).data('next'));
                        }
                    });
                    if (self.data('info') === 'reverse') {
                            //console.log('Bridge Successfully.');
                            terminalButton = all_button.filter(function (index, button) {
                                return $(button).data('next').includes(data_name) && $(button).data('info') == 'terminal' && $(button).hasClass('disable') == true;
                            });
                            $(terminalButton).addClass('toggle');
                            $(terminalButton).each(function(){
                                return bro_buttonlist.push($(this).data('name'));
                            });
                        }
                    /* 路徑相關但沒上下關係的遠房親戚按鈕也拿給path_checker檢查一下 */
                    if (typeof data_disrelative !== 'undefined') {
                        $.merge(bro_buttonlist, data_disrelative);
                    }
                    path_checker(data_name, bro_buttonlist);
                    /* AP cost 處理*/
                    AP_left = AP_left - AP_cost;
                    $(self).closest('div.tabcontent').find('span[data-type="AP_pool"]').text(AP_left);
                    /* Archetype 點數處理*/
                    if (typeof data_type_req !== 'undefined') {
                        req_archetype.text((parseInt(req_archetype.text()) + 1));
                    }
                });
                return false;
            }
            else {
                console.log("This Toggle Button already have 'enable' class.");
                return false;
            }
        }
        else {
            console.log("This Toggle Button doesn't have 'toggle' class.");
            return false;
        }
    });
    /* Disable */
    $('.containerslot button').contextmenu(function(){
        let AP_left = parseInt($(this).closest('div.tabcontent').find('span[data-type="AP_pool"]').text());
        let AP_cost = parseInt($(this).data('cost'));
        let data_name = $(this).data('name');
        let data_last = $(this).data('last');
        let data_next = $(this).data('next');
        let data_req = $(this).data('req');
        let data_type_req = $(this).data('type-req');
        let data_type_req_min = $(this).data('type-req-min');
        let data_archetype = $(this).closest('div.tabcontent').find('span[data-type]');
        let data_disrelative = $(this).data('disrelative');
        let self = $(this);
        let req_archetype;
        if ($(this).hasClass('toggle') == true) {
            let is_there_anybody_need_Me = false; 
            let temp = all_button.filter(function(){return $(this).data('req')==data_name;});
            temp.each(function(){
                if ($(this).hasClass('enable')) {
                    is_there_anybody_need_Me = true;
                    return false;
                }
            });
            if (is_there_anybody_need_Me) {
                console.log('有其他技能需要這個技能啊gay owo凸')
                return false;
            }
            if ($(this).hasClass('enable') == true) {
                $(this).addClass('disable');
                $(this).removeClass('enable');
                //console.log('Disable Ability.');
                $(function(){
                    let bro_buttonlist = [];
                    $.each(data_next, function (index, name) {
                        let next_button = $('button[data-name="' + name + '"]');
                        next_button.removeClass('toggle');
                    });
                    $.each(data_last, function (index, name) {
                        let last_button = $('button[data-name="' + name + '"]');
                        if (last_button.hasClass('enable') == true) {
                            let childbutton = all_button.filter(function(index, button) {return $(button).data('last').includes(name);});
                            let childbutton_donthaveEnable = true;
                            $(childbutton).each(function(){
                                if ($(this).hasClass('enable')) {
                                    childbutton_donthaveEnable = false;
                                }
                                if (($(this).data('info') == 'reverse') && (last_button.data('info')=='terminal')) {
                                    let terminaldonthaveEnablelastbutton = lastbutton_of_terminal_checker(last_button, name);
                                    //console.log('terminal的前面按鈕是否沒有Enable開關? :'+terminaldonthaveEnablelastbutton);
                                    if (terminaldonthaveEnablelastbutton == true) {
                                        childbutton_donthaveEnable = true;
                                    }
                                }
                            });
                            if (childbutton_donthaveEnable) {
                                last_button.addClass('toggle');
                            }
                            

                            if (last_button.data('info') == 'lock') {
                                //console.log('Unlock Successfully.');
                                childbutton.addClass('toggle');
                            }

                            $.merge(bro_buttonlist, $(last_button).data('next'));
                        }
                    });
                    if (self.data('info') === 'terminal') {
                        //console.log('de-Bridge Successfully.');
                        all_button.filter(function (index, button) {
                            return $(button).data('last').includes(data_name) && $(button).data('info') == 'reverse' && $(button).hasClass('enable') == true;}).addClass('toggle');
                    }
                    if (self.data('info') === 'reverse') {
                            //console.log('Destroy Bridge Successfully.');
                            all_button.filter(function (index, button) {
                                return $(button).data('next').includes(data_name) && $(button).data('info') == 'terminal' && $(button).hasClass('disable') == true;}).removeClass('toggle');
                        }
                    if (typeof data_disrelative !== 'undefined') {
                        $.merge(bro_buttonlist, data_disrelative);
                    }
                    path_checker(data_name, bro_buttonlist);
                    AP_left = AP_left + AP_cost;
                    $(self).closest('div.tabcontent').find('span[data-type="AP_pool"]').text(AP_left);
                    if (typeof data_type_req !== 'undefined') {
                        req_archetype = data_archetype.filter(function(){return $(this).data('type') == data_type_req;});
                        req_archetype.text((parseInt(req_archetype.text()) - 1));
                    }
                });
            return false;
            }
            else {
                console.log("This Toggle Button already have 'disable' class.");
                return false;
            }
        }
        else {
            console.log("This Toggle Button doesn't have 'toggle' class.");
            return false;
        } 
    });
});