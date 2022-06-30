$(document).ready(function() {
    $(this).scrollTop(0);

    /* 防止所有按鈕出現右鍵選單 */
    $('button').bind('contextmenu', function(){
        return false;
    });
    
    let all_button = $('button[data-last][data-next]');
    let all_img = $('img[data-last][data-next]');
    let path_checker = function(current_data_name, brother_button) {
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
        
        //console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n觸發按鈕: ' + current_data_name + '\n附近啟動狀態的按鈕: ' + arraylist +'\n\n同輩按鈕: '+ brother_button +'\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        
        $(relateImg).each(function() {
            let owo = $(this);
            //console.log('窩的名字: '+ $(owo).attr('class'));
            //console.log('窩連接的上一個按鈕: '+$(owo).data('last')+' [type: '+$.type($(owo).data('last'))+']');
            //console.log('窩連接的下一個按鈕: '+$(owo).data('next')+' [type: '+$.type($(owo).data('last'))+']');
            //console.log('--------------------');
            let owo_last = $(owo).data('last');
            let last_boolean;
            $(owo_last).each(function(owo_index, head_button) {
                if ($.inArray(head_button, arraylist) != -1) {
                    last_boolean = true;
                    //console.log('檢查頭: '+head_button+' ['+last_boolean+']');
                }
                else {
                    last_boolean = false;
                    //console.log('檢查頭: '+head_button+' ['+last_boolean+']');
                    return false;
                }
            });

            let owo_next = $(owo).data('next');
            let next_boolean;
            $(owo_next).each(function(owo_index, end_button) {
                if ($.inArray(end_button, arraylist) != -1) {
                    next_boolean = true;
                    //console.log('檢查尾: '+end_button+' ['+next_boolean+']');
                    return false;
                }
                else {
                    next_boolean = false;
                    //console.log('檢查尾: '+end_button+' ['+next_boolean+']');
                }
            });

            
            //console.log('頭最終結果: '+last_boolean);
            //console.log('尾最終結果: '+next_boolean);
            if ((last_boolean == true) && (next_boolean == true)) {
                owo.addClass('active');
                //console.log('狀態: 激活啦\n==============================');
            }
            else {
                owo.removeClass('active');
                //console.log('狀態: 關掉啦\n==============================');
            }
        });

        console.log('Path checked complected.');
        //console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
        return false;
    }

    /* Disable -> Enable：

    1. [與我連接] 且 [同個group] 且又是 [Disable狀態] 的按鈕都給予toggle

    2. [在我之後] 且 [不同group] 且又是 [Disable狀態] 的按鈕都給予toggle

    3. 把 [在我之前] 且 [不同group] 且又是 [Enable狀態] 的按鈕
        => 如果是 [別的group] 的按鈕
            -> 檢查其 [自身後方] 是否有 [跟自身不同group] 且 [Enable狀態] 的按鈕
                有 > 拔掉它的toggle
            -> 檢查其 [自身的group] 中是否有 ([與它自身連接] 且 [Enable狀態] 的按鈕 && [與它自身連接] 且 [Disable狀態] 的按鈕)
                沒有 > 拔掉它的toggle
        => 如果是 [非group] 的按鈕
                -> 檢查其後方是否有 [Enable狀態] 的按鈕
                    有 -> 拔掉它toggle
    4. [與我連接] 且 [同個group] 且又是 [Enable狀態] 的按鈕 = "那個"
        => 那個按鈕後面有啟動狀態的外部子屬按鈕？
                  有 -> 拔掉那個按鈕的toggle
                沒有 -> 我們有沒有共同的父級按鈕？
                      有 > 不用理那個按鈕
                    沒有 > 拔掉那個按鈕的toggle


    Enable -> Disable：

    1. 如果有任何 [與我連接] 且 [同個group] 的按鈕是 [Enable狀態]
        -> 它自身是[Enable]
        -> [與我連接] 且 [同個group]
        -> [它的前一個(不在group裡的)按鈕是Enable狀態] 且 [它的後面沒有Enable狀態(且不在group裡)的按鈕]
        -> 與它相連的內部按鈕中跟它擁有的共同祖先按鈕是Enable狀態
        => 給toggle

    2. 如果沒任何 [與我連接] 且 [同個group] 的按鈕是 [Enable狀態]
        => [與我連接] 且 [同個group] 且 [沒有跟Enable狀態且不同group的前一個按鈕連接] 且 [自身是Disable狀態] 的按鈕都拔掉toggle

    3. [在我之前] 且 [不同group] 且又是 [Enable狀態] 的按鈕
        => 如果是 [別的group] 的按鈕
            -> 檢查其 [自身後方] 是否有 [跟自身不同group] 且 [Enable狀態] 的按鈕
                沒有 > 檢查其 [自身的group] 且 [與它自身連接] 的按鈕之中是否"都是" [Enable狀態] 的按鈕
                        沒有 > 給它toggle
        => 如果是 [非group] 的按鈕
            -> 檢查其後方是否有 [Enable狀態] 的按鈕
                沒有 -> 給它toggle

    4.把 [在我之後] 且 [不同group] 且又是 [Disable狀態] 的按鈕的toggle拔掉 */
    let exit_checker = function (self) {
        let dataName = $(self).data('name');
        let dataLast = $(self).data('last');
        let dataNext = $(self).data('next');
        let dataGroup = $(self).data('group');
        let activePartner = $();
        let storage = [];
        console.info('[Exit Checker] 開始尋找出口，出發點: <' + dataName + '>');
        console.group();
        all_button.filter(function(){
            return ($(this).data('group') === dataGroup) && (($(this).data('last').includes(dataName)) || ($(this).data('next').includes(dataName)));
        }).add($(self)).each(function(){
            let mySelf = $(this);
            let myLast = $(this).data('last');
            let tempArray = [];
            console.group();
            console.info('[Exit Checker] 檢查: <' + $(mySelf).data('name') + '>');
            if ($(mySelf).hasClass('enable')) {
                activePartner = activePartner.add($(mySelf).not(self));
                $.each(myLast, function(index, value){
                    let testData = $('button[data-name="' + value + '"]')
                    if (($(testData).hasClass('enable')) && ($(testData).data('group')!==dataGroup)) {
                        console.info('[Exit Checker] 找到出口: <' + $(testData).data('name') + '>');
                        tempArray.push($(testData).data('name'));
                    }
                });
            }
            else {
                console.info('[Exit Checker] <' + $(mySelf).data('name') + '> 是 Disable 狀態');
                console.groupEnd();
                return;
            }
            console.groupEnd();
            
            //console.log('tempArray: ' + tempArray + ' (' + tempArray.length + ') [' + $.type(tempArray) + ']');
            if (tempArray.length !== 0) {
                storage.push(tempArray);
            }
        });
        console.groupEnd();

        

        console.info('[Exit Checker] 目前獲得內容: ' + storage + ' [' + storage.length + ']');
        if ((storage.length === 0) && (activePartner.get() != '')) {
            activePartner.each(function(){
                console.warn('[Exit Checker] 找不到出口\n嘗試以 <' + $(this).data('name') + '> 為中心再次進行搜尋');
                let getData = exit_checker($(this));
                if (getData.length !== 0) {
                    storage.push(getData);
                }
            });
        }

        
        console.info('[Exit Checker] 運行結束\n[Exit Checker] 回傳資料: ' + storage + ' [' + storage.length + ']');
        return storage;
    }

    let group_checker = function (data, data_name) {
        let result = true;
        let that_last = $(data).data('last');
        let that_next = $(data).data('next');
        let group_num = $(data).data('group');
        let exParent = false;
        let exChild = false;
        let inGroup = 0;
        console.info('[Group Checker] 開始運行，出發點: <' + data_name + '>');
        //外部父級按鈕 [not in Group, Enable state]
        all_button.filter(function(){
            return (($(this).data('next').includes(data_name)) && ($(this).data('group') !== group_num));
        }).each(function(){
            if ($(this).hasClass('enable')) {
                exParent = true;
                return false;
            }
        });

        //外部子屬按鈕 [not in Group, Enable state]
        all_button.filter(function(){
            return (($(this).data('last').includes(data_name)) && ($(this).data('group') !== group_num));
        }).each(function(){
            if ($(this).hasClass('enable')) {
                if (typeof $(this).data('group') == 'undefined') {
                    exChild = true;
                    return false;
                }
                else {
                    console.warn('[Group Checker] 偵測到外部子屬按鈕擁有 Group 標籤\n嘗試呼叫 [Exit Checker] 檢測其出口數量');
                    let temp = exit_checker($(this));
                    console.info('[Group Checker] 收到 [Exit Checker] 的回傳內容');
                    let testfor = function(element){
                        return (element.includes(data_name) && (element.length == 1));
                    }
                    if (temp.every(testfor)) {
                        exChild = true;
                        return false;
                    }
                }
            }
        });

        //內部連接按鈕 [in same Group, Enable state]
        all_button.filter(function(){
            return (($(this).data('last').includes(data_name)||$(this).data('next').includes(data_name)) && ($(this).data('group') === group_num));
        }).each(function(){
            if ($(this).hasClass('enable')) {
                inGroup = inGroup + 1;
            }
        });


        if (exChild == false) {
            console.info('[Group Checker]\n確認 <' + data_name + '> 沒有連接外部子屬按鈕\n嘗試呼叫 [Exit Checker] 檢查出口');
            let checker = exit_checker(data);
            console.info('[Group Checker] 收到 [Exit Checker] 的回傳內容');
            if (exParent == false) {
                if ($(data).hasClass('enable')) {
                    if (inGroup > 1) {
                        console.warn('[Group Checker] 確認 <' + data_name + '> 沒有連接外部父級按鈕 但它負責連接同組的按鈕\n -> 不通過');
                        result = false;
                    }
                    else if (inGroup == 1) {
                        console.info('[Group Checker] 確認 <' + data_name + '> 沒有連接外部父級按鈕 只有連接一個同組按鈕\n -> 通過檢測');
                        result = true;
                    }
                    else {
                        console.error('[Group Checker] 確認 <' + data_name + '> 沒有連接外部父級按鈕 也沒有連接任何同組按鈕\n -> 它不該出現');
                        result = false;
                    }
                }
                else {
                    if (inGroup > 1) {
                        console.warn('[Group Checker] 確認 <' + data_name + '> 沒有連接外部父級按鈕 但有多個同組按鈕可供它連接\n -> 不通過');
                        result = true;
                    }
                    else if (inGroup == 1) {
                        console.info('[Group Checker] 確認 <' + data_name + '> 沒有連接外部父級按鈕 但有一個同組按鈕可供它連接\n -> 通過檢測');
                        result = true;
                    }
                    else {
                        console.warn('[Group Checker] 確認 <' + data_name + '> 沒有連接外部父級按鈕 也沒有任何同組按鈕供它連接\n -> 不通過');
                        result = false;
                    }
                }
            }
            else {
                if ($(data).hasClass('enable')) {
                    if (checker.length > 1) {
                        console.info('[Group Checker] 確認 <' + data_name + '> 有連接外部父級按鈕 但並非對外連接的唯一主幹\n -> 通過檢測');
                        result = true;
                    }
                    else if ((checker.length == 1) && (inGroup != 0)) {
                        console.warn('[Group Checker] 確認 <' + data_name + '> 有連接外部父級按鈕 且是對外連接的唯一主幹\n -> 不通過');
                        result = false;
                    }
                    else {
                        console.info('[Group Checker] 確認 <' + data_name + '> 有連接外部父級按鈕 但沒有連接任何內部按鈕\n -> 通過檢測');
                        result = true;
                    }
                }
                else {
                    console.info('[Group Checker] 確認 <' + data_name + '> 有連接外部父級按鈕 但它本身是 Disable 的狀態\n -> 通過檢測');
                    result = true;
                }
            }
        }
        else {
            console.warn('[Group Checker] 確認 <' + data_name + '> 有連接外部子屬按鈕，終止檢測');
            result = false;
        }

        if (result == true) {
            console.info('[Group Checker] 運行結束\n[Group Checker] 回傳資料: 允許 <' + data_name + '> 擁有 toggle');
        }
        else {
            console.info('[Group Checker] 運行結束\n[Group Checker] 回傳資料: 不允許 <' + data_name + '> 擁有 toggle');
        }

        return result;
    }

    let array_comparison = function (arr1, arr2) {
        let result = false;
        $.each(arr1, function(index, value){
            if ($.inArray(value, arr2) !== -1) {
                result = true;
                return false;
            }
        });
        return result;
    }

    let array_librarian = function (arr1, arr2) {
        let result = [];
        $.each(arr1, function(index, value){
            if ($.inArray(value, arr2) !== -1) {
                result.push(value);
            }
        })
        return result;
    }

    let group_manager = function (self_data, self_name, last_datalist, next_datalist, state) {
        let result = [];
        let group_number = $(self_data).data('group');
        let group_datalist = all_button.filter(function(){
            return $(this).not(self_data).data('group') == group_number && ($(this).not(self_data).data('last').includes(self_name)||$(this).not(self_data).data('next').includes(self_name));
        });
        let nextData = $();
        $.each(next_datalist, function(index, value){
            nextData = nextData.add($('button[data-name="' + value + '"]'));
        });

        let lastData = $(); 
        $.each(last_datalist, function(index, value){
            lastData = lastData.add($('button[data-name="' + value + '"]'));
        });



        if (state == 'Enable') {
            console.log('Trigger Enable');

            group_datalist.each(function(){
                let my_self = $(this);
                let my_group = $(this).data('group');
                let my_last = $(this).data('last');
                let my_next = $(this).data('next');
                let my_name = $(this).data('name');
                console.info('[Group Manager] 嘗試呼叫 [Group Checker] 檢測 <' + my_name + '>');
                if (group_checker(my_self, my_name)) {
                    $(my_self).addClass('toggle');
                    console.warn('已給予 <' + my_name + '> toggle 的權限');
                }
                else {
                    $(my_self).removeClass('toggle');
                    console.warn('已撤銷 <' + my_name + '> toggle 的權限');
                }
            });

            nextData.filter(function(){
                return ($(this).data('group') !== group_number) && ($(this).hasClass('disable')); 
            }).each(function(){
                $(this).addClass('toggle');
                console.warn('已給予 <' + $(this).data('name') + '> toggle 的權限');
            });

            lastData.filter(function(){
                return ($(this).data('group') !== group_number) && ($(this).hasClass('enable'));
            }).each(function(){
                let my_self = $(this);
                let my_group = $(this).data('group');
                let my_last = $(this).data('last');
                let my_next = $(this).data('next');
                let my_name = $(this).data('name');
                if (typeof my_group !== 'undefined') {
                    console.info('[Group Manager] 嘗試呼叫 [Group Checker] 檢測 <' + my_name + '>');
                    if (group_checker(my_self, my_name)) {
                        $(my_self).addClass('toggle');
                        console.warn('已給予 <' + my_name + '> toggle 的權限');
                    }
                    else {
                        $(my_self).removeClass('toggle');
                        console.warn('已撤銷 <' + my_name + '> toggle 的權限');
                    }
                }
                else {
                    $.each(my_next, function(index, name){
                        let testData = $('button[data-name="' + name + '"]');
                        if ($(testData).hasClass('enable')) {
                            $(my_self).removeClass('toggle');
                            console.warn('已撤銷 <' + my_name + '> toggle 的權限');
                            return false;
                        }
                    });
                }
            });
        }

        else if (state == 'Disable') {
            console.log('Trigger Disable');
            
            $(group_datalist).each(function(){
                let my_self = $(this);
                let my_name = $(this).data('name');
                let my_last = $(this).data('last');
                let my_next = $(this).data('next');
                console.info('[Group Manager] 嘗試呼叫 [Group Checker] 檢測 <' + my_name + '>');
                if (group_checker(my_self, my_name)) {
                    $(my_self).addClass('toggle');
                    console.warn('已給予 <' + my_name + '> toggle 的權限');
                }
                else {
                    $(my_self).removeClass('toggle');
                    console.warn('已撤銷 <' + my_name + '> toggle 的權限');
                }
            });
            
            lastData.filter(function(){
                return ($(this).data('group') !== group_number) && ($(this).hasClass('enable'));
            }).each(function(){
                let my_self = $(this);
                let my_group = $(this).data('group');
                let my_last = $(this).data('last');
                let my_next = $(this).data('next');
                let my_name = $(this).data('name');
                if (typeof my_group !== 'undefined') {
                    console.info('[Group Manager] 嘗試呼叫 [Group Checker] 檢測 <' + my_name + '>');
                    if (group_checker(my_self, my_name)) {
                        $(my_self).addClass('toggle');
                        console.warn('已給予 <' + my_name + '> toggle 的權限');
                    }
                    else {
                        $(my_self).removeClass('toggle');
                        console.warn('已撤銷 <' + my_name + '> toggle 的權限');
                    }
                }
                else {
                    let next_check = true;
                    $.each(my_next, function(index, name){
                        let testData = $('button[data-name="' + name + '"]');
                        if ($(testData).hasClass('enable')) {
                            next_check = false;
                            return false;
                        }
                    });
                    if (next_check == true) {
                        $(my_self).addClass('toggle');
                        console.warn('已給予 <' + my_name + '> toggle 的權限');
                    }
                }
            });

            nextData.filter(function(){
                return ($(this).data('group') !== group_number) && ($(this).hasClass('disable')); 
            }).each(function(){
                let my_self = $(this);
                let my_group = $(this).data('group');
                let my_last = $(this).data('last');
                let my_next = $(this).data('next');
                let my_name = $(this).data('name');
                if (typeof my_group == 'undefined') {
                    $(my_self).removeClass('toggle');
                    console.warn('已撤銷 <' + my_name + '> toggle 的權限');
                }
                else {
                    console.info('[Group Manager] 嘗試呼叫 [Group Checker] 檢測 <' + my_name + '>');
                    if (group_checker(my_self, my_name)) {
                        $(my_self).addClass('toggle');
                        console.warn('已給予 <' + my_name + '> toggle 的權限');
                    }
                    else {
                        $(my_self).removeClass('toggle');
                        console.warn('已撤銷 <' + my_name + '> toggle 的權限');
                    }
                }
            });
        }

        else {
            console.log("忘了加參數啦!!!OAO!!!");
            return false;
        }

        return group_datalist;
    }

    /* Button Click Event */
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
        let data_group = $(this).data('group');
        let data_lock = $(this).data('lock');
        let self = $(this);
        let req_archetype;
        console.clear();
        if ($(this).hasClass('lock') != true) {
            if ($(this).hasClass('toggle') == true) {
                // Enable //
                if ($(this).hasClass('disable') == true) {
                    $(this).addClass('enable');
                    $(this).removeClass('disable');
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
                    if (typeof data_lock !== 'undefined') {
                        $.each(data_lock, function(index, name){
                            $('button[data-name="' + name + '"]').addClass('lock');
                        });
                    }
                    
                    //console.log('Enable Ability.');
                    $(function(){
                        let bro_buttonlist = [];
                        /* 在此技能之後且互相連接的技能允許點擊*/
                        $.each(data_next, function (index, name) {
                            let next_button = $('button[data-name="' + name + '"]');
                            //console.log(name+' 是reverse? :['+(next_button.data('info') == 'reverse')+'], 是enable狀態? :['+(next_button.hasClass('enable'))+']');
                            
                            if (typeof data_group == 'undefined') {
                                next_button.addClass('toggle');
                            }
                        });
                        $.each(data_last, function (index, name) {
                            let last_button = $('button[data-name="' + name + '"]');
                            if (last_button.hasClass('enable') == true) {
                                /* 在此此技能之前且互相連接而且又是enable狀態的技能禁止點擊*/
                                if (typeof data_group == 'undefined') {
                                    last_button.removeClass('toggle');
                                }

                                /* 拿到上一個Enable狀態中的Button所持有其之後連接的Button名字列表並篩選出Enable狀態的按鈕清單給path_checker用 */
                                $.merge(bro_buttonlist, $(last_button).data('next'));
                            }
                        });
                        if (typeof data_group !== 'undefined') {
                            let grouplist = group_manager(self, data_name, data_last, data_next, 'Enable');
                            
                            $(grouplist).each(function(){
                                return bro_buttonlist.push($(this).data('name'));
                            });
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
                // Disable //
                if ($(this).hasClass('enable') == true) {
                    $(this).addClass('disable');
                    $(this).removeClass('enable');
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
                    if (typeof data_lock !== 'undefined') {
                        $.each(data_lock, function(index, name){
                            $('button[data-name="' + name + '"]').removeClass('lock');
                        });
                    }
                    //console.log('Disable Ability.');
                    $(function(){
                        let bro_buttonlist = [];
                        $.each(data_next, function (index, name) {
                            let next_button = $('button[data-name="' + name + '"]');
                            if (typeof data_group == 'undefined') {
                                next_button.removeClass('toggle');
                            }
                        });
                        $.each(data_last, function (index, name) {
                            let last_button = $('button[data-name="' + name + '"]');
                            if (last_button.hasClass('enable') == true) {
                                if (typeof data_group == 'undefined') {
                                    if (typeof last_button.data('group') == 'undefined') {
                                        let childButton = all_button.filter(function(index, button) {return $(button).data('last').includes(name);});
                                        let checker = true;
                                        $(childButton).each(function(){
                                            if ($(this).hasClass('enable')) {
                                                checker = false;
                                                return false;
                                            }
                                        });
                                        if (checker) {
                                            last_button.addClass('toggle');
                                        }
                                    }
                                    else {
                                        if (group_checker(last_button, name)) {
                                            last_button.addClass('toggle');
                                        }
                                    }
                                }

                                $.merge(bro_buttonlist, $(last_button).data('next'));
                            }
                        });
                        if (typeof data_group !== 'undefined') {
                            let grouplist = group_manager(self, data_name, data_last, data_next, 'Disable');
                            
                            $(grouplist).each(function(){
                                return bro_buttonlist.push($(this).data('name'));
                            });
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
                // Exception //
                else {
                    console.log("There is an exception happened on this button, please report.");
                    return false;
                }
            }
            else {
                console.log("This Toggle Button doesn't have 'toggle' class.");
                return false;
            }
        }
        else {
            console.log("This Button has been locked.");
            return false;
        }
    });
});