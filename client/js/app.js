function transactions() {
    return {
        /////////////////////////////////////////
        /////////////////////////////////////////
        //init var
        /////////////////////////////////////////
        /////////////////////////////////////////
        xhr:undefined,
        /////////////////////////////////////////
        /////////////////////////////////////////
        //methods
        /////////////////////////////////////////
        /////////////////////////////////////////
        init:function() {
            return new Promise((resolve, reject) => {
                this.xhr = new XMLHttpRequest();
                this.xhr.open('GET', 'api/event');
                this.xhr.send(null);
                this.xhr.onreadystatechange = this.onComplete.bind(this, resolve, reject);
            })
        },
        //--------------------------------------------------------------------------------
        onComplete:function(resolve, reject) {
            var DONE = 4;
            var OK = 200;
            let json;
            if (this.xhr.readyState === DONE) {
                if (this.xhr.status === OK) {
                    this.json = JSON.parse(this.xhr.responseText);
                    this.drawout_table();
                    resolve(this.json);
                } else {
                    reject(this.xhr.status);
                    return;
                }
            }
        },
        //--------------------------------------------------------------------------------
        drawout_table:function() {
            var duration;
            var hours;
            this.json.sort(function(a, b){
                return b.out-a.out
            });
            //--------------------
            this.json.forEach(function(item) {
                let cls;
                //36e5 is the scientific notation for 60*60*1000
                item.duration = this.get_duration(item.out, item.in);
                item.price = this.get_price(item.duration);
                //--------------------
                if (item.duration <= 1) {
                    cls = "blue";
                } else if (item.duration >= 24) {
                    cls = "red";
                }
                //--------------------
                item.in = this.get_date_formatted(item.in);
                item.out = this.get_date_formatted(item.out);
                document.getElementsByTagName("body")[0].getElementsByTagName("tbody")[0].insertAdjacentHTML("beforeend", this.tmpl(item, cls));
            }.bind(this));
        },
        //--------------------------------------------------------------------------------
        get_duration:function(tout, tin) {
            let hours = Math.abs(tout - tin) / 36e5;
            return this.hundredths(hours);
        },
        //--------------------------------------------------------------------------------
        get_price:function(duration) {
            return (duration <= 1) ? "FREE" :"$"+(this.hundredths((duration - 1) * 2.99).toFixed(2));
        },
        //--------------------------------------------------------------------------------
        hundredths:function(num) {
            return Math.ceil(num * 100) / 100;
        },
        //--------------------------------------------------------------------------------
        tmpl:function(item, cls) {
            return `<tr${(cls) ? " class = \""+cls+"\"": ""}> 
            <td>${item.license}</td> 
            <td>${item.price}</td> 
            <td>${item.duration}</td> 
            <td>${item.in}</td> 
            <td>${item.out}</td> 
            </tr>`
        },
        //--------------------------------------------------------------------------------
        get_date_formatted:function(date) {
            date = new Date(date);
            return date.toString('MM/dd/yyyy h:mm:ss tt');
        },
    }
}