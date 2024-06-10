var flyui = function () { };
flyui.prototype = function () {
    var _f = function (id) {
        return document.getElementById(id);
    },
        _set_style = function (el, property, val) {
            if (_f(el) instanceof Array) {
                for (var i = 0; i <= el.length - 1; i++) {
                    el[i].style[property] = val
                };
            } else {
                _f(el).style[property] = val;
            }
        },
        _show = function (el) {
            _set_style(el, 'display', 'block');
        },
        _hide = function (el) {
            _set_style(el, 'display', 'none');
        },
    _reset_tabs = function (el) {
        var tab = _f(el);
        var _tab_nodes = tab.getElementsByTagName("UL");
        var _content_child_nodes = _tab_nodes[1].getElementsByTagName("LI");
        for (var p = 0; p <= _content_child_nodes.length - 1; p++) {
            _content_child_nodes[p].className='';
        }
    },
    _render_tab = function (el) {
        var tab = _f(el);
        var _tab_nodes = tab.getElementsByTagName("UL");
        var _header_child_nodes = _tab_nodes[0].getElementsByTagName("LI");
        var _content_child_nodes = _tab_nodes[1].getElementsByTagName("LI");
       
        for (var i = 0; i < _header_child_nodes.length; i++) {
            _header_child_nodes[i].setAttribute("onclick", "var x_tab = this.parentNode.parentNode.getElementsByTagName('UL')[1].getElementsByTagName('LI');for (i = 0; i < x_tab.length; i++) {x_tab[i].style.display='none';};x_tab[" + i + "].style.display='block';");
           //console.log(_header_child_nodes[i].parentNode.childNodes[1].length);
        }
        
    },
    _render_pop = function (el) {
        var pop_elem = _f(el);
        _remove_by_class('overlay');
        var overlay = document.createElement("DIV");
        overlay.className = 'overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', function () {
            pop_elem.style.display = 'none';
            this.parentNode.removeChild(this);
        })
        overlay.style.display = 'block';
        pop_elem.style.display = 'block';
    },
    _remove_by_class = function(class_name){
        var elements = document.getElementsByClassName(class_name);
        while(elements.length > 0){
            elements[0].parentNode.removeChild(elements[0]);
        }
    },
    _bind_tab_toggle = function (el) {
        el.style.display = 'block';

    },
    _tab = function (el) {
        _render_tab(el);
    },
    _pop = function (el) {
        _render_pop(el);
    };
    return {
        pop: _pop,
        tab:_tab
    }
}();