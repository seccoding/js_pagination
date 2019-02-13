class Pagination {

    constructor(pageCount = 10, prevText = "Prev", nextText = "Next") {
        this._pageCount = pageCount;
        this._prevText = prevText;
        this._nextText = nextText;
        this._index = -1;
        this._navCount = 0;
    }

    init(data = {
        width: "100%",
        title: undefined,
        query: "#wrapper",
        data: [],
        subject: [],
        cols: [],
        key: "",
        callback: function(key) {console.log(key)}
    }) {
        this._width = (data.width || "100%");
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

    getDoc(selector) {
        if ( selector ) {
            return document.querySelector(this._query + " " + selector)
        }
        return document.querySelector(this._query);
    }

    getDocAll(selector) {
        if ( selector ) {
            return document.querySelectorAll(this._query + " " + selector)
        }
        return undefined;
    }

    show(index = 0, searchValue = "") {
        if ( index < 0 ) {
            index = 0;
        }

        this._search = searchValue; 
        let that = this;
        let datas = this._data.filter((d) => {
            let i = 0;
            for ( let k in d ) {
                if ( typeof(d[k]) != "object" ) {
                    if ( (d[k]+ "").includes(this._search) ) {
                        return true;
                    }
                }
                else {
                    let value = this._extractValue(d, that._cols[i]) + "";

                    if ( value.includes(this._search) ) {
                        return true;
                    }
                }
                i++;
            }
            
            return false;
        });

        this._index = index;
        this.calculatePagenateParams(this._index);
        let data = datas.slice(this._start, this._end);
        let html = this._showData(data);

        this._nowGroup = parseInt(this._index / this._navPageCount);
        this._navCount = Math.ceil(datas.length / this._pageCount);

        this._show(html);

        this.getDoc(".search").value = this._search;
        this.getDoc(".search").focus();
    }

    go(index = 0, searchValue = "") {
        if ( index < 0 ) {
            index = 0;
        }

        this._search = searchValue; 
        let that = this;
        let datas = this._data.filter((d) => {
            let i = 0;
            for ( let k in d ) {
                if ( typeof(d[k]) != "object" ) {
                    if ( (d[k]+ "").includes(this._search) ) {
                        return true;
                    }
                }
                else {
                    let value = this._extractValue(d, that._cols[i]) + "";

                    if ( value.includes(this._search) ) {
                        return true;
                    }
                }
                i++;
            }
            
            return false;
        });

        this._index = index;
        this.calculatePagenateParams(this._index);
        let data = datas.slice(this._start, this._end);
        let html = this._replaceData(data);

        this._nowGroup = parseInt(this._index / this._navPageCount);
        this._navCount = Math.ceil(datas.length / this._pageCount);

        this._replace(html);

        this.getDoc(".search").value = this._search;
        this.getDoc(".search").focus();
    }

    next(searchValue = "") {
        this.go((this._nowGroup + 1) * this._navPageCount, searchValue);
    }

    prev(searchValue = "") {
        this.go((this._nowGroup - 1) * this._navPageCount, searchValue);
    }

    first(searchValue = "") {
        this.go(0, searchValue);
    }

    last(searchValue = "") {
        this.go(this._navCount-1, searchValue);
    }

    calculatePagenateParams(index) {
        this._start = this._pageCount * index;
        this._end = this._start + this._pageCount;
    }

    _showData(data) {
        this._count = data.length;

        let html = `
            <div class="grid-wrapper" style="width: ${this._width};">
                <div>
                    ${this._title}
                    <div class="search-wrapper">
                        <input type="text" class="search" placeholder="Search" />
                    </div>
                </div>
                <table class="grid">
                    <colgroup>`;

                    this._titles.forEach((title, i) => {
                        html += `<col class="${title}" />`;
                    });

                    html += `</colgroup>
                    <thead>
                        <tr>`;

        this._titles.forEach((title, i) => {
            html += `<th data-id="${title}">${title}<div class="col-selector"></div></th>`;
        });

        html += `
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.forEach((dt, i) => {
            html += `<tr data-key="${dt[this._key]}">`
            this._cols.forEach((col, i) => {

                let value = dt[col];

                if ( typeof(col) == "object" ) {
                    value = this._extractValue(dt, col);
                }

                html += `
                        <td data-id="${this._titles[i]}">${value}</div></td>
                `;
            });
            html += "</tr>"
        });

        html += `
                    </tbody>
                </table>
                <div class="nav"></div>`;
        
        return html;
    }

    _replaceData(data) {
        this._count = data.length;

        let html = "";

        data.forEach((dt, i) => {
            html += `<tr data-key="${dt[this._key]}">`
            this._cols.forEach((col, i) => {

                let value = dt[col];

                if ( typeof(col) == "object" ) {
                    value = this._extractValue(dt, col);
                }

                html += `
                        <td data-id="${this._titles[i]}">${value}</div></td>
                `;
            });
            html += "</tr>"
        });
        
        return html;
    }

    _extractValue(dt, columns) {
        if ( typeof(columns) == "object" ) {
            for ( let key in columns ) {
                if ( typeof(columns[key]) == "object" ) {
                    return this._extractValue(dt[key], columns[key])
                }
                else {
                    return dt[key][columns[key]];
                }
            }
        }
        else {
            return dt[columns];
        }
    }

    _show(data) {
        //data += this._paginate();
        data += "</div>";
        this.getDoc().innerHTML = data;

        let page = this._paginate();
        this.getDoc(".nav").insertAdjacentHTML("afterbegin", page);
        this._setEvents(this);
    }

    _replace(data) {

        (function(that) {
            that.getDoc(".nav").innerHTML = that._paginate();
        })(this);
        
        this.getDoc(".grid tbody").innerHTML = "";
        this.getDoc(".grid tbody").insertAdjacentHTML("afterbegin", data);
        this._setEvents(this);
    }

    _setEvents(that) {
        (function generatePaginate() {
            
            let groupId = undefined;
            let x, diffX = undefined;
            let col = undefined;
            let colWidth = undefined;
            let selectors = that.getDocAll(".col-selector");

            selectors.forEach((div, i) => {
                
                if ( (i+1) % parseInt(that._cols.length) > 0 ) {
                    div.addEventListener("mouseover", (e) => {
                        groupId = e.target.parentElement.attributes[0].nodeValue;
                        that.getDoc(`.${groupId}`).style.borderRight = "1px double #000";
                    });
    
                    div.addEventListener("mousedown", (e) => {
                        if ( !groupId ) {
                            groupId = e.target.parentElement.attributes[0].nodeValue;
                        }

                        col = that.getDoc(`.${groupId}`);
                        x = e.pageX;
                        colWidth = e.target.parentElement.offsetWidth + 2;
                    });
    
                    document.addEventListener("mousemove", (e) => {                    
                        if ( col ) {
                            diffX = e.pageX - x;
                            col.style.width = colWidth + diffX + "px"
                        }
                    });
    
                    document.addEventListener("mouseup", (e) => {
                        if ( col ) {
                            that.getDoc(`.${groupId}`).style.borderRight = "1px solid #555";
                            groupId = undefined;
                            x = undefined;
                            diffX = undefined;
                            col = undefined;
                            colWidth = undefined;
                        }
                    });
    
                    div.addEventListener("mouseout", (e) => {
                        if ( groupId && !col ) {
                            that.getDoc(`.${groupId}`).style.borderRight = "1px solid #555";
                        }
                    });
                }
                
            });
        })();

        (function search() {
            let search = that.getDoc(".search");
            search.addEventListener("keyup", (e) => {
                that.go(0, search.value);
            });
        })();

        (function rowClick() {
            that.getDocAll("tbody>tr").forEach((tr, i) => {
                tr.addEventListener("click", (e) => {
                    that._callback(tr.attributes[0].nodeValue);
                });
            });
        })();

        (function addPageClickEvent() {
            let first = that.getDoc(".first");
            if(first) {
                first.addEventListener("click", (e) => {
                    that.first(that._search);
                });
            }

            let prev = that.getDoc(".prev");
            if(prev) {
                prev.addEventListener("click", (e) => {
                    that.prev(that._search);
                });
            }

            let go = that.getDocAll(".go");
            if(go) {
                go.forEach((li, i) => {
                    li.addEventListener("click", (e) => {
                        that.go(li.attributes[1].nodeValue, that._search);
                    })
                });
            }

            let next = that.getDoc(".next");
            if(next) {
                next.addEventListener("click", (e) => {
                    that.next(that._search);
                });
            }

            let last = that.getDoc(".last");
            if(last) {
                last.addEventListener("click", (e) => {
                    that.last(that._search);
                });
            }
        })();
    }

    _paginate() {
        let startPage = this._nowGroup * this._navPageCount;
        let endPage = startPage + this._navPageCount;
        
        if ( endPage >= this._navCount ) {
            endPage = this._navCount;
        }
        
        let data = `<ul>`;
        if ( startPage >= this._pageCount ) {
            data += `<li class="first">First</li>`
            data += `<li class="prev">${this._prevText}</li>`
        }

        for ( let i = startPage; i < endPage; i++ ) {
            data += `<li class="go" data-index="${i}">${i == this._index ? '<b>'+(i+1)+'</b>' : i+1}</li>`;
        }

        if ( endPage < this._navCount ) {
            data += `<li class="next">${this._nextText}</li>`
            data += `<li class="last">Last</li>`
        }

        data += `</ul>`;

        return data;
    }

}
