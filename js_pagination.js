class Pagenation {

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
        this._width = data.width;
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
        this._navPageCount = 2;

        this._search = "";
    }

    go(index = 0, searchValue = "") {
        if ( index < 0 ) {
            index = 0;
        }

        this._search = searchValue;

        let datas = this._data.filter((d) => {
            for ( let k in d ) {
                if ( (d[k]+ "").includes(this._search) ) {
                    return true;
                }
            }
            return false;
        });

        this._index = index;
        this.calculatePagenateParams(this._index);
        let data = datas.slice(this._start, this._end);
        let html = this._showData(data);

        this._nowGroup = parseInt(this._index / this._navPageCount);
        this._navCount = Math.ceil(datas.length / this._pageCount);

        this._show(this._query, html);
        document.querySelector("#search").value = this._search;
        document.querySelector("#search").focus();
    }

    next() {
        this.go((this._nowGroup + 1) * this._navPageCount);
    }

    prev() {
        this.go((this._nowGroup - 1) * this._navPageCount);
    }

    first() {
        this.go(0);
    }

    last() {
        this.go(this._navCount-1);
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
                    <div class="search">
                        <input type="text" id="search" placeholder="Search" />
                    </div>
                </div>
                <table class="grid">
                    <colgroup>`;

                    this._titles.forEach((title, i) => {
                        html += `<col id="${title}" />`;
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
                html += `
                        <td data-id="${this._titles[i]}">${dt[col]}<div class="col-selector"></div></td>
                `;
            });
            html += "</tr>"
        });

        html += `
                    </tbody>
                </table>`;
        
        return html;
    }

    _show(querySelector, data) {
        let that = this;

        data += this._paginate();

        data += "</div>";

        document.querySelector(querySelector).innerHTML = data;

        (function generatePaginate() {
            
            let groupId = undefined;
            let x, diffX = undefined;
            let col = undefined;
            let colWidth = undefined;
            let selectors = document.querySelectorAll(".col-selector")
           
            selectors.forEach((div, i) => {

                if ( (i+1) % parseInt(that._cols.length) > 0 ) {
                    div.addEventListener("mouseover", (e) => {
                        groupId = e.target.parentElement.attributes[0].nodeValue;
                        document.querySelector(`#${groupId}`).style.borderRight = "1px double #000";
                    });
    
                    div.addEventListener("mousedown", (e) => {
                        if ( !groupId ) {
                            groupId = e.target.parentElement.attributes[0].nodeValue;
                        }
                        col = document.querySelector(`#${groupId}`);
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
                            document.querySelector(`#${groupId}`).style.borderRight = "1px solid #555";
                            groupId = undefined;
                            x = undefined;
                            diffX = undefined;
                            col = undefined;
                            colWidth = undefined;
                        }
                    });
    
                    div.addEventListener("mouseout", (e) => {
                        if ( groupId && !col ) {
                            document.querySelector(`#${groupId}`).style.borderRight = "1px solid #555";
                        }
                    });
                }
                
            });
        })();

        (function search() {
            let search = document.querySelector("#search");
            search.addEventListener("keyup", (e) => {
                that.go(0, search.value);
            });
        })();

        (function rowClick() {
            document.querySelectorAll("tbody>tr").forEach((tr, i) => {
                tr.addEventListener("click", (e) => {
                    that._callback(tr.attributes[0].nodeValue);
                });
            });
        })();

        (function addPageClickEvent() {
            let first = document.querySelector(".first");
            if(first) {
                first.addEventListener("click", (e) => {
                    that.first();
                });
            }

            let prev = document.querySelector(".prev");
            if(prev) {
                prev.addEventListener("click", (e) => {
                    that.prev();
                });
            }

            let go = document.querySelectorAll(".go");
            if(go) {
                go.forEach((li, i) => {
                    li.addEventListener("click", (e) => {
                        that.go(li.attributes[1].nodeValue);
                    })
                });
            }

            let next = document.querySelector(".next");
            if(next) {
                next.addEventListener("click", (e) => {
                    that.next();
                });
            }

            let last = document.querySelector(".last");
            if(last) {
                last.addEventListener("click", (e) => {
                    that.last();
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
        
        let data = `<div class="nav"><ul>`;
        if ( startPage >= this._pageCount ) {
            data += `<li class="first">First</li>`
            data += `<li class="prev">${this._prevText}</li>`
        }

        for ( let i = startPage; i < endPage; i++ ) {
            data += `<li class="go" data-index="${i}" onclick="page.go(${i})">${i == this._index ? '<b>'+(i+1)+'</b>' : i+1}</li>`;
        }

        if ( endPage < this._navCount ) {
            data += `<li class="next">${this._nextText}</li>`
            data += `<li class="last">Last</li>`
        }

        data += `</ul></div>`;

        return data;
    }

}
