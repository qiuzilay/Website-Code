$(document).ready(function() {
    const selectbar = {
        "objects": $('.menubox input.selectbar'),
        "filters": {
            "objects": $('.menubox input.search-select-options'),
            "database": {}
        },
        "options": $('div.menubox div.dropdown-menu li:not(.optgroup)'),
        "active": false,
        "target": null
    };

    $.fn.exist = function () {
        return this.length !== 0;
    }
    
    class Examine {
        static null(variable) {
            return JSON.stringify(variable) == null;
        }

        static defined(variable) {
            return typeof variable !== 'undefined';
        }
    }

    class LaunchEvent {
        static buildata() {
            
            $.each(selectbar.filters.objects, function() {
                const self = {
                    "filter": $(this),
                    "owner": $(this).parent('div.dropdown-menu').siblings('input.selectbar'),
                    "options": {
                        "json": {
                            "Others": {}
                        },
                        "array": []
                    }
                };

                $.each(self.filter.siblings('ul.select-options').find('li.optgroup'), function() {
                    self.options.json[$(this).data('optgroup')] = {
                        "optObject": {},
                        "object": $(this),
                        "display": 0
                    };
                });

                $.each(self.filter.siblings('ul.select-options').find('li:not(.optgroup)'), function() {
                    if (Examine.defined($(this).data('belong'))) {
                        self.options.json[$(this).data('belong')].optObject[$(this).text()] = $(this);
                        self.options.json[$(this).data('belong')].display += 1;
                    }
                    else {
                        self.options.json.Others[$(this).text()] = $(this);
                    }

                    self.options.array.push($(this).text());
                });

                selectbar.filters.database[self.owner.attr('name')] = self
            });

            return false;
        }
    }

    class EventHandler {
        static selectbar() {

            selectbar.objects.on('click', function() {
                const self = {
                    "object": $(this),
                    "menu": $(this).siblings('div.dropdown-menu')
                };
                const target = self.menu.find('li:not(.optgroup)').filter((index, listObj) => {
                    return $(listObj).text() == self.object.val()
                });
                
                if (!Examine.null(selectbar.target)) {$(window).click()}

                self.menu.css({"display": "block"}).addClass('dropdown-menu--active');
                if (!selectbar.active) {
                    target[0].scrollIntoView({block: "nearest"});
                    target.addClass('hover');
                }
                selectbar.active = true;
                selectbar.target = self;

                return false;
            });

            selectbar.filters.objects.on('input', function() {
                const inputext = $(this).val();
                const data = selectbar.filters.database[$(this).parent('div.dropdown-menu').siblings('input.selectbar').attr('name')];
                const match = $.map(data.options.array, function(optname, index) {
                    if (RegExp(`^${inputext}`, 'gmu').test(optname)) {return optname}
                });

                //console.info(data.options.json);
                //console.info(selectbar.filters.database[data.owner.attr('name')].options.json);
                $.each(data.options.json, function(indexI, json) {
                    if (Examine.defined(json.optObject)) {
                        $.each(Object.entries(json.optObject), function(indexII, array) {

                            if ( (!match.includes(array[0])) && (array[1].css('display') != 'none') ) {
                                array[1].css({"display": "none"});
                                data.options.json[array[1].data('belong')].display -= 1;
                            }
                            else if ( (match.includes(array[0])) && (array[1].css('display') != 'list-item') ) {
                                array[1].css({"display": "list-item"});
                                data.options.json[array[1].data('belong')].display += 1;
                            }

                        });

                        if (json.display == 0) {json.object.css({"display": "none"})}
                        else {json.object.css({"display": "list-item"})}
                    }
                    else {
                        $.each(Object.entries(json), function(indexII, array) {
                            if (!match.includes(array[0])) {
                                array[1].css({"display": "none"});
                            }
                            else {
                                array[1].css({"display": "list-item"});
                            }
                        });
                    }
                });

                return false;
            });

            $(window).on('click', function(event) {
                if (!$(event.target).is('div.dropdown-menu--active, .dropdown-menu--active input.selectbar, .dropdown-menu--active input.search-select-options, .dropdown-menu--active ul.select-options, .dropdown-menu--active li.optgroup')) {
                    if (selectbar.active) {
                        if ($(event.target).is('li')) {
                            $(event.target).closest('div.dropdown-menu').siblings('input.selectbar').val($(event.target).text());
                        }
                        
                        selectbar.target.menu.css({"display": "none"}).removeClass('dropdown-menu--active');
                        selectbar.target.menu.children('input.search-select-options').val(null);
                        selectbar.active = false;
                        selectbar.target = null;
                    }
                }

                return false;
            });

            selectbar.options.hover(function() {selectbar.options.removeClass('hover')});

        }
    }

    LaunchEvent.buildata();
    EventHandler.selectbar();

})