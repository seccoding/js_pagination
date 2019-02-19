"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pagination = function () {
    function Pagination() {
        var pageCount = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
        var prevText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "Prev";
        var nextText = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Next";

        _classCallCheck(this, Pagination);

        this._pageCount = pageCount;
        this._prevText = prevText;
        this._nextText = nextText;
        this._index = -1;
        this._navCount = 0;
    }

    _createClass(Pagination, [{
        key: "init",
        value: function init() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
                width: "100%",
                title: undefined,
                query: "#wrapper",
                data: [],
                subject: [],
                cols: [],
                key: "",
                callback: function callback(key) {
                    console.log(key);
                }
            };

            this._width = data.width || "100%";
            this._title = data.title;
            this._query = data.query;
            this._data = data.data;
            this._count = this._data.length;
            this._titles = data.subject;
            this._cols = data.cols;
            this._key = data.key;
            this._callback = data.callback;

            this._navCount = Math.ceil(this._data.length / this._pageCount);
            this._nowGroup = 0;
            this._navPageCount = 10;

            this._search = "";
        }
    }, {
        key: "getDoc",
        value: function getDoc(selector) {
            if (selector) {
                return document.querySelector(this._query + " " + selector);
            }
            return document.querySelector(this._query);
        }
    }, {
        key: "getDocAll",
        value: function getDocAll(selector) {
            if (selector) {
                return document.querySelectorAll(this._query + " " + selector);
            }
            return undefined;
        }
    }, {
        key: "show",
        value: function show() {
            var _this = this;

            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var searchValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

            if (index < 0) {
                index = 0;
            }

            this._search = searchValue;
            var that = this;
            var datas = this._data.filter(function (d) {
                var i = 0;
                for (var k in d) {
                    if (_typeof(d[k]) != "object") {
                        if ((d[k] + "").includes(_this._search)) {
                            return true;
                        }
                    } else {
                        var value = _this._extractValue(d, that._cols[i]) + "";

                        if (value.includes(_this._search)) {
                            return true;
                        }
                    }
                    i++;
                }

                return false;
            });

            this._index = index;
            this.calculatePagenateParams(this._index);
            var data = datas.slice(this._start, this._end);
            var html = this._showData(data);

            this._nowGroup = parseInt(this._index / this._navPageCount);
            this._navCount = Math.ceil(datas.length / this._pageCount);

            this._show(html);

            this.getDoc(".search").value = this._search;
            //this.getDoc(".search").focus();
        }
    }, {
        key: "go",
        value: function go() {
            var _this2 = this;

            var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var searchValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

            if (index < 0) {
                index = 0;
            }

            this._search = searchValue;
            var that = this;
            var datas = this._data.filter(function (d) {
                var i = 0;
                for (var k in d) {
                    if (_typeof(d[k]) != "object") {
                        if ((d[k] + "").toUpperCase().includes(_this2._search.toUpperCase())) {
                            return true;
                        }
                    } else {
                        var value = _this2._extractValue(d, that._cols[i]) + "";

                        if (value.toUpperCase().includes(_this2._search.toUpperCase())) {
                            return true;
                        }
                    }
                    i++;
                }

                return false;
            });

            this._index = index;
            this.calculatePagenateParams(this._index);
            var data = datas.slice(this._start, this._end);
            var html = this._replaceData(data);

            this._nowGroup = parseInt(this._index / this._navPageCount);
            this._navCount = Math.ceil(datas.length / this._pageCount);

            this._replace(html);

            this.getDoc(".search").value = this._search;
            //this.getDoc(".search").focus();
        }
    }, {
        key: "next",
        value: function next() {
            var searchValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            this.go((this._nowGroup + 1) * this._navPageCount, searchValue);
        }
    }, {
        key: "prev",
        value: function prev() {
            var searchValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            this.go((this._nowGroup - 1) * this._navPageCount, searchValue);
        }
    }, {
        key: "first",
        value: function first() {
            var searchValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            this.go(0, searchValue);
        }
    }, {
        key: "last",
        value: function last() {
            var searchValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

            this.go(this._navCount - 1, searchValue);
        }
    }, {
        key: "calculatePagenateParams",
        value: function calculatePagenateParams(index) {
            this._start = this._pageCount * index;
            this._end = this._start + this._pageCount;
        }
    }, {
        key: "_showData",
        value: function _showData(data) {
            var _this3 = this;

            this._count = data.length;

            var html = "\n            <div class=\"grid-wrapper\" style=\"width: " + this._width + ";\">\n                <div>\n                    " + this._title + "\n                    <div class=\"search-wrapper\">\n                        <input type=\"text\" class=\"search\" placeholder=\"Search\" />\n                    </div>\n                </div>\n                <table class=\"grid\">\n                    <colgroup>";

            this._titles.forEach(function (title, i) {
                html += "<col class=\"" + title + "\" />";
            });

            html += "</colgroup>\n                    <thead>\n                        <tr>";

            this._titles.forEach(function (title, i) {
                html += "<th data-id=\"" + title + "\">" + title + " " + (i + 1 != _this3._titles.length ? "<div class=\"col-selector\"></div>" : "") + "</th>";
            });

            html += "\n                        </tr>\n                    </thead>\n                    <tbody>\n        ";

            data.forEach(function (dt, i) {
                html += "<tr data-key=\"" + dt[_this3._key] + "\">";
                _this3._cols.forEach(function (col, i) {

                    var value = dt[col];

                    if ((typeof col === "undefined" ? "undefined" : _typeof(col)) == "object") {
                        value = _this3._extractValue(dt, col);
                    }

                    html += "\n                        <td data-id=\"" + _this3._titles[i] + "\">" + value + "</div></td>\n                ";
                });
                html += "</tr>";
            });

            html += "\n                    </tbody>\n                </table>\n                <div class=\"nav\"></div>";

            return html;
        }
    }, {
        key: "_replaceData",
        value: function _replaceData(data) {
            var _this4 = this;

            this._count = data.length;

            var html = "";

            data.forEach(function (dt, i) {
                html += "<tr data-key=\"" + dt[_this4._key] + "\">";
                _this4._cols.forEach(function (col, i) {

                    var value = dt[col];

                    if ((typeof col === "undefined" ? "undefined" : _typeof(col)) == "object") {
                        value = _this4._extractValue(dt, col);
                    }

                    html += "\n                        <td data-id=\"" + _this4._titles[i] + "\">" + value + "</div></td>\n                ";
                });
                html += "</tr>";
            });

            return html;
        }
    }, {
        key: "_extractValue",
        value: function _extractValue(dt, columns) {
            if ((typeof columns === "undefined" ? "undefined" : _typeof(columns)) == "object") {
                for (var key in columns) {
                    if (_typeof(columns[key]) == "object") {
                        return this._extractValue(dt[key], columns[key]);
                    } else {
                        return dt[key][columns[key]];
                    }
                }
            } else {
                return dt[columns];
            }
        }
    }, {
        key: "_show",
        value: function _show(data) {
            //data += this._paginate();
            data += "</div>";
            this.getDoc().innerHTML = data;

            var page = this._paginate();
            this.getDoc(".nav").insertAdjacentHTML("afterbegin", page);
            this._setEvents(this);

            (function search(that) {
                var _search = that.getDoc(".search");

                var specialCharacters = ["F", "Shift", "Tab", "Caps", "Cont", "Alt", "Enter", "Insert", "Home", "End", "Page", "Arrow", "NumLock", "Print", "Scroll", "Pause", "Meta", "Esc", "NumpadEnter"];

                _search.addEventListener("keyup", function (e) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = specialCharacters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var specialCharacter = _step.value;

                            if (e.code.indexOf(specialCharacter) == 0) {
                                return;
                            }
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    that.go(0, _search.value);
                });
            })(this);

            (function moveCellEvent(that) {

                var groupId = undefined;
                var x = void 0,
                    diffX = undefined;
                var col = undefined;
                var colWidth = undefined;
                var selectors = that.getDocAll(".col-selector");

                selectors.forEach(function (div, i) {

                    if ((i + 1) % parseInt(that._cols.length) > 0) {
                        div.addEventListener("mouseover", function (e) {
                            groupId = e.target.parentElement.attributes[0].nodeValue;
                            that.getDoc("." + groupId).style.borderRight = "1px double #000";
                        });

                        div.addEventListener("mousedown", function (e) {
                            if (!groupId) {
                                groupId = e.target.parentElement.attributes[0].nodeValue;
                            }

                            col = that.getDoc("." + groupId);
                            x = e.pageX;
                            colWidth = e.target.parentElement.offsetWidth + 2;
                        });

                        document.addEventListener("mousemove", function (e) {
                            if (col) {
                                diffX = e.pageX - x;
                                col.style.width = colWidth + diffX + "px";
                            }
                        });

                        document.addEventListener("mouseup", function (e) {
                            if (col) {
                                that.getDoc("." + groupId).style.borderRight = "1px solid #555";
                                groupId = undefined;
                                x = undefined;
                                diffX = undefined;
                                col = undefined;
                                colWidth = undefined;
                            }
                        });

                        div.addEventListener("mouseout", function (e) {
                            if (groupId && !col) {
                                that.getDoc("." + groupId).style.borderRight = "1px solid #555";
                            }
                        });
                    }
                });
            })(this);
        }
    }, {
        key: "_replace",
        value: function _replace(data) {

            (function (that) {
                that.getDoc(".nav").innerHTML = that._paginate();
            })(this);

            this.getDoc(".grid tbody").innerHTML = "";
            this.getDoc(".grid tbody").insertAdjacentHTML("afterbegin", data);
            this._setEvents(this);
        }
    }, {
        key: "_setEvents",
        value: function _setEvents(that) {

            (function rowClick() {
                that.getDocAll("tbody>tr").forEach(function (tr, i) {
                    tr.addEventListener("click", function (e) {
                        that._callback(tr.attributes[0].nodeValue);
                    });
                });
            })();

            (function addPageClickEvent() {
                var first = that.getDoc(".first");
                if (first) {
                    first.addEventListener("click", function (e) {
                        that.first(that._search);
                    });
                }

                var prev = that.getDoc(".prev");
                if (prev) {
                    prev.addEventListener("click", function (e) {
                        that.prev(that._search);
                    });
                }

                var go = that.getDocAll(".go");
                if (go) {
                    go.forEach(function (li, i) {
                        li.addEventListener("click", function (e) {
                            that.go(li.attributes[1].nodeValue, that._search);
                        });
                    });
                }

                var next = that.getDoc(".next");
                if (next) {
                    next.addEventListener("click", function (e) {
                        that.next(that._search);
                    });
                }

                var last = that.getDoc(".last");
                if (last) {
                    last.addEventListener("click", function (e) {
                        that.last(that._search);
                    });
                }
            })();
        }
    }, {
        key: "_paginate",
        value: function _paginate() {
            var startPage = this._nowGroup * this._navPageCount;
            var endPage = startPage + this._navPageCount;

            if (endPage >= this._navCount) {
                endPage = this._navCount;
            }

            var data = "<ul>";
            if (startPage >= this._pageCount) {
                data += "<li class=\"first\">First</li>";
                data += "<li class=\"prev\">" + this._prevText + "</li>";
            }

            for (var i = startPage; i < endPage; i++) {
                data += "<li class=\"go\" data-index=\"" + i + "\">" + (i == this._index ? '<b>' + (i + 1) + '</b>' : i + 1) + "</li>";
            }

            if (endPage < this._navCount) {
                data += "<li class=\"next\">" + this._nextText + "</li>";
                data += "<li class=\"last\">Last</li>";
            }

            data += "</ul>";

            return data;
        }
    }]);

    return Pagination;
}();