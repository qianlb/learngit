// JavaScript Document
var GBIChart = (function () {
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   Number  h       The hue
     * @param   Number  s       The saturation
     * @param   Number  l       The lightness
     * @return  Array           The RGB representation
     */
    function hslToRgb(h, s, l) {
        var r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and l in the set [0, 1].
     *
     * @param   Number  r       The red color value
     * @param   Number  g       The green color value
     * @param   Number  b       The blue color value
     * @return  Array           The HSL representation
     */
    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
    }
    function ParamTest(obj, param) {
        for (var i = 0, errorStr = "", len = param.length; i < len; i++) {
            if (!obj[param[i]]) {
                errorStr += "errorType : object parameter error,\nerrorMessage : " + param[i] + " can't be null!!!!!!!!!!!!!!!!!!\n\n";
            }
        }
        if (errorStr) {
            return false;
        } else {
            return true;
        }
    }
    function clone(obj) {
        if (typeof (obj) != 'object' || obj == null)
            return obj;
        var re = {};
        if (obj.constructor == Array)
            re = [];
        for (var i in obj) {
            re[i] = clone(obj[i]);
        }
        return re;
    }
    var BarChart = (function () {

        function createChartDOM() {
            //默认值
            this.data = null;
            this.showLegend = null;
            this.color = null;
            this.spacing = 0.1;
            this.top = 30;
            this.right = 150;
            this.left = 30;
            this.bottom = 30;
            this.width = 600;
            this.height = 400;
            this.yPoint = null;
            this.yText = "";
            this.yFormat = null;
            this.yAside = "";
            this.yHeader = "";
            this.yNumber = null;
            this.xAside = "";
            this.xHeader = "";
            this.graticule = null;
            this.tipTextCallBack = function (d, data) {
                return "<strong>" + d.name + ":</strong> <span style='color:red'>" + d.value + "</span>";
            };
            this.fontFamily = "arial";
            this.fontSize = "13px";
            this.xText = "";
            this.categoryField = "name";
        }
        createChartDOM.prototype = {
            write: function (chartType) {
                if (!ParamTest(this, ["selector", "data"])) {
                    return;
                }
                //数据处理
                var _this = this,
				showNames = d3.keys(this.data[0]).filter(function (key) { return key !== _this.categoryField; }),
				allDataYAxis = {
				    yTarget: "All",
				    yPoint: this.yPoint,
				    yText: this.yText,
				    yFormat: this.yFormat,
				    yAside: this.yAside,
				    yHeader: this.yHeader,
				    yNumber: this.yNumber
				};
                this.chartType = chartType || this.chartType;
                this.obj = {
                    selector: this.selector,
                    data: this.data,
                    showLegend: this.showLegend || showNames,
                    showNames: showNames,
                    fontFamily: this.fontFamily,
                    spacing: this.spacing,
                    color: this.color ? d3.scale.ordinal().range(this.color) : d3.scale.category20c(),
                    tipTextCallBack: this.tipTextCallBack,
                    xText: this.xText,
                    yAxisList: this.yAxisList ? this.yAxisList : [allDataYAxis],
                    margin: { top: this.top || 0, left: this.left || 0, right: this.right || 0, bottom: this.bottom || 0 },
                    width: this.width - this.left - this.right,
                    height: this.height - this.top - this.bottom,
                    title: this.title,
                    categoryField: this.categoryField,
                    xAside: this.xAside,
                    xHeader: this.xHeader,
                    graticule: this.graticule,
                    chartType: this.chartType,
                    optimize: this.optimize,
                    fontSize: this.fontSize,
                    xAxisInterval: this.xAxisInterval,
                    rawData: clone(this.data),
                    UID:this.UID
                };
                //调用相应的函数
                this[chartType]();
            },
            createGroupBarChart: function () {
                //设置是否是group的值
                var _this = this;
                this.obj["group"] = true;
                this.obj.data.forEach(function (d) {
                    d.ages = _this.obj.showLegend.map(function (name) {
                        return { name: name, value: +d[name], category: d[_this.obj.categoryField] };
                    });
                });
                var axisCallback = this.createAxisCallback(),
					axis = this.createAxis(axisCallback),
					tip = this.createTip(),
					svg = this.drawSvg()
                title = this.drawTitle(svg);
                this.drawAxis(svg, axis);
                this.drawBar(svg, axisCallback, tip);
                this.createLegend(svg);
            },
            createRotateGroupBarChart: function () {
                var _this = this;
                this.obj["group"] = true;
                this.obj.data.forEach(function (d) {
                    d.ages = _this.obj.showLegend.map(function (name) {
                        return { name: name, value: +d[name], category: d[_this.obj.categoryField] };
                    });
                });
                var axisCallback = this.createRotateAxisCallback(),
					axis = this.createRotateAxis(axisCallback),
					tip = this.createTip(),
					svg = this.drawSvg()
                title = this.drawTitle(svg);
                this.drawAxis(svg, axis);
                this.drawRotateBar(svg, axisCallback, tip);
                this.createLegend(svg);
            },
            createRotateBarChart: function () {
                var _this = this;
                this.obj["group"] = false;
                this.obj.data.forEach(function (d) {
                    d.ages = _this.obj.showLegend.map(function (name) {
                        return { name: name, value: +d[name], category: d[_this.obj.categoryField] };
                    });
                });
                var axisCallback = this.createRotateAxisCallback(),
					axis = this.createRotateAxis(axisCallback),
					tip = this.createTip(),
					svg = this.drawSvg()
                title = this.drawTitle(svg);
                this.drawAxis(svg, axis);
                this.drawRotateBar(svg, axisCallback, tip);
            },
            createBarChart: function () {
                //设置是否是group的值
                var _this = this;
                this.obj["group"] = false;
                this.obj.data.forEach(function (d) {
                    d.ages = _this.obj.showLegend.map(function (name) {
                        return { name: name, value: +d[name], category: d[_this.obj.categoryField] };
                    });
                });
                var axisCallback = this.createAxisCallback(),
					axis = this.createAxis(axisCallback),
					tip = this.createTip(),
					svg = this.drawSvg()
                title = this.drawTitle(svg);
                this.drawAxis(svg, axis);
                this.drawBar(svg, axisCallback, tip);
            },
            createStackedSvg: function (obj) {
                var _this = this,
                    obj = _this.obj;

                var margin = obj.margin,
                width = obj.width,
                height = obj.height,
				fontFamily = obj.fontFamily,
				fontSize = obj.fontSize,
				graticule = obj.graticule,
				yNumber = obj.yNumber;

                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], obj.spacing || .1);

                var y = d3.scale.linear()
                    .rangeRound([height, 0]);

                var color = d3.scale.ordinal().range(obj.color);

                var xAxis = d3.svg
                              .axis()
                              .scale(x)
                              .orient("bottom");

                var yAxis = d3.svg
                              .axis()
                              .scale(y)
                              .orient("left")
                              .tickFormat(obj.yFormat ? (Object.prototype.toString.call(obj.yFormat) === "[object Function]" ? obj.yFormat : d3.format(obj.yFormat)) : d3.format(".2s"));
                if (graticule == "reseau") {
                    xAxis.tickSize(-height);
                    yAxis.tickSize(-width);
                }
                if (yNumber || yNumber == 0) {
                    yAxis.ticks(yNumber);
                }
                var svg = d3.select(obj.selector).html("").append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var data = obj.data;

                color.domain(d3.keys(data[0]).filter(function (key) { return key !== obj.categoryField; }));

                data.forEach(function (d) {
                    var y0 = 0;
                    d.values = _this.obj.showLegend.map(function (name) {
                        return { name: name, y0: y0, y1: y0 += +d[name], Value: +d[name], categoryField: d[obj.categoryField] };
                    });
                    d.total = d.values.length && d.values[d.values.length - 1].y1 || 0;
                });

                x.domain(data.map(function (d) {
                    return d[obj.categoryField];
                }));
                y.domain([0, d3.max(data, function (d) { return d.total; })]).nice();


                var XAxis = svg.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0," + height + ")")
                   .style("font-family", fontFamily)
                   .call(xAxis)
                XAxis.append("text")
                  .attr("x", width)
                  .attr("y", 35)
                  .attr("dy", ".71em")
                  .style("text-anchor", "end")
                    .text(obj.xAside || obj.xText || "");
                XAxis.append("text")
                 .attr("x", width / 2)
                 .attr("y", 42)
                 .attr("font-weight", "bold")
                 .attr("dy", ".71em")
                 .style("text-anchor", "middle")
                   .text(obj.xHeader || "");

                var YAxis = svg.append("g")
                    .attr("class", "y axis")
                   	.style("font-family", fontFamily)
                    .call(yAxis);
                YAxis.append("text")
					  .attr("y", -15)
					  .attr("x", 0)
					  .attr("dy", ".71em")
					  .style("text-anchor", "end")
						.text(obj.yAside || obj.yText || "");
                YAxis.append("text")
                 .attr("transform", "rotate(-90)")
                 .attr("x", -height / 2)
                 .attr("y", -90)
                 .attr("font-weight", "bold")
                 .attr("dy", ".71em")
                   .text(obj.yHeader || "");
                XAxis.selectAll("line").style("stroke", "#c1c1c1");
                YAxis.selectAll("line").style("stroke", "#c1c1c1");
                if (obj.optimize) {
                    this.xAxisOptimize(svg);
                }


                var state = svg.selectAll(".state")
                               .data(data)
                               .enter().append("g")
                               .attr("class", "g")
                               .attr("transform", function (d) { return "translate(" + x(d[obj.categoryField]) + ",0)"; });

                state.selectAll("rect")
                     .data(function (d) { return d.values; })
                     .enter().append("rect")
                     .attr("width", x.rangeBand())
                     .attr("y", function (d) { return y(d.y1); })
                     .attr("height", function (d) { return y(d.y0) - y(d.y1); })
                     .style("fill", function (d) {
                         return obj.color(d["name"]);
                     });

                var tip = d3.tip()
                            .attr('class', 'd3-tip')
                   			.style("font-family", fontFamily)
                   			.style("font-size", fontSize)
                            .offset([0, 10])
                            .html(
                            obj.tipTextCallBack || function (_rect) {
                                return "<strong>" + _rect[obj.categoryField] + "</strong> <span style='color:red'>" + (_rect.Value) + "</span>";
                            });

                svg.call(tip);

                svg.selectAll('g.g').selectAll('rect')
                    .on('mouseover', tip.show)
                      .on('mouseout', tip.hide);

                return svg;
            },
            createStackedBarChart: function (obj) {
                var obj = this.obj;
                var _svg = this.createStackedSvg(obj);
                this.drawTitle(_svg);
                this.createLegend(_svg);
            },
            createStackedGroupBarChart: function (obj) {
                var obj = this.obj;
                var _svg = this.createStackedGroupSvg(obj);
                this.drawTitle(_svg);
                _svg = this.createTwoDimensionLegend(_svg);
            },
            convertDataToLegends: function (data) {
                if (data.type) {
                    if (data.type == "stackedGroup") {
                        var _data = data.data, result = { stackObj: [], groupObj: [] };
                        var stackObjContainer = {}, groupObjContainer = {};

                        data.data.forEach(function (groupObj) {
                            Object.keys(groupObj).forEach(function (stackName) {
                                stackObjContainer[stackName] = "";
                            });
                        });

                        data.data.forEach(function (groupObj) {
                            Object.keys(groupObj).forEach(function (stackName) {
                                if (typeof (groupObj[stackName]) == "object") {
                                    Object.keys(groupObj[stackName]).forEach(function (element) {
                                        groupObjContainer[element] = "";
                                    });
                                }
                            });
                        });

                        delete stackObjContainer[data.categoryField];

                        result.stackObj = stackObjContainer;
                        result.groupObj = groupObjContainer;
                        return result;
                    }
                }
            },
            createStackedGroupSvg: function (obj) {
                var _this = this,
                    obj = _this.obj;

                obj.legends = obj.legends || this.convertDataToLegends({ type: "stackedGroup", data: obj.rawData, categoryField: obj.categoryField });
                obj.displayedLegend = obj.displayedLegend || clone(obj.legends);

                obj.stackNames = obj.stackNames || Object.keys(obj.legends.stackObj);
                obj.groupNames = obj.groupNames || Object.keys(obj.legends.groupObj);

                var margin = obj.margin,
                width = obj.width,
                height = obj.height;
                var data = obj.data;

                var rgbBases = [{ r: 105, g: 31, b: 31 }, { r: 39, g: 75, b: 37 }, { r: 27, g: 58, b: 90 }]

                //var rgbs = [{ r: 62, g: 231, b: 5 }, { r: 191, g: 155, b: 45 }, { r: 109, g: 132, b: 104 }]



                var _color = function (data) {
                    var _rgb = rgbBases[data.groupSeq % rgbBases.length];
                    var hsl = rgbToHsl(_rgb.r, _rgb.g, _rgb.b);

                    hsl[2] = (data.stackSeq / data.stackNames.length) * 0.6 + 0.2;

                    //hsl[0] = (data.stackSeq / data.stackNames.length) * 0.6 + 0.2;

                    var rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);

                    return "#" + rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
                };


                if (!obj.twoDimensionColorObj) {

                    obj.twoDimensionColorObj = { stack: {}, group: {} };

                    obj.stackNames.forEach(function (e) {
                        obj.twoDimensionColorObj.stack[e] = [];
                        obj.twoDimensionColorObj[e] = {};
                    })

                    obj.groupNames.forEach(function (e) {
                        obj.twoDimensionColorObj.group[e] = [];
                    })

                    for (var i = 0 ; i < obj.stackNames.length ; i++) {
                        for (var j = 0 ; j < obj.groupNames.length ; j++) {
                            var colorResult = _color({ groupSeq: j, groupNames: obj.groupNames, stackSeq: i, stackNames: obj.stackNames });
                            obj.twoDimensionColorObj.stack[obj.stackNames[i]].push(colorResult);
                            obj.twoDimensionColorObj.group[obj.groupNames[j]].push(colorResult);
                            obj.twoDimensionColorObj[obj.stackNames[i]][obj.groupNames[j]] = colorResult;
                        }
                    }
                }

                data.forEach(function (d) {
                    d.values = [];
                    d.totals = [];

                    var i = 0;

                    obj.groupNames.forEach(function (groupName) {

                        if (obj.displayedLegend.groupObj[groupName] === undefined) {
                            return;
                        }

                        var y0 = 0, stackSeq = -1;

                        var thisValues = obj.stackNames.map(function (stackName) {
                            stackSeq++;

                            var _value = (d[stackName] && d[stackName][groupName] && obj.displayedLegend.stackObj[stackName] != undefined && obj.displayedLegend.groupObj[groupName] != undefined) ? d[stackName][groupName] : 0;

                            return {
                                stackName: stackName,
                                groupName: groupName,
                                groupSeq: i,
                                stackSeq: stackSeq,
                                y0: y0
                                , y1: y0 += +(_value)
                                , Value: +(_value)
                            }
                        });

                        d.totals[i] = thisValues.length && thisValues[thisValues.length - 1].y1 || 0;

                        thisValues.forEach(function (_thisValue) { d.values.push(_thisValue); });
                        i++;

                    });

                });


                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], obj.spacing || .1);



                var y = d3.scale.linear()
                    .rangeRound([height, 0]);

                var color = d3.scale.ordinal().range(obj.color);

                var xAxis = d3.svg
                              .axis()
                              .scale(x)
                              .orient("bottom");

                var yAxis = d3.svg
                              .axis()
                              .scale(y)
                              .orient("left")
                              .tickFormat(obj.yFormat ? (Object.prototype.toString.call(obj.yFormat) === "[object Function]" ? obj.yFormat : d3.format(obj.yFormat)) : d3.format(".2s"));

                var svg = d3.select(obj.selector).html("").append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                color.domain(d3.keys(data[0]).filter(function (key) {
                    return key !== obj.categoryField;
                }));






                var xGroup = d3.scale.ordinal();

                xGroup.domain(obj.groupNames).rangeRoundBands([0, x.rangeBand()]);

                x.domain(data.map(function (d) { return d[obj.categoryField]; }));
                y.domain([0, d3.max(data, function (d) {
                    return Math.max.apply(null, d.totals);
                })]);

                svg.append("g")
                   .attr("class", "x axis")
                   .attr("transform", "translate(0," + height + ")")
                   .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text(obj.yText || "");

                var state = svg.selectAll(".state")
                               .data(data)
                               .enter().append("g")
                               .attr("class", "g")
                               .attr("transform", function (d) { return "translate(" + x(d[obj.categoryField]) + ",0)"; });



                var _xAxisCount = Object.keys(obj.displayedLegend.groupObj).length;

                state.selectAll("rect")
                     .data(function (d) {
                         return d.values;
                     })
                     .enter().append("rect")
                     .attr("width", x.rangeBand() / _xAxisCount)
					  .attr("x", function (d) {
					      return x.rangeBand() * (d.groupSeq / _xAxisCount);
					  })
                     .attr("y", function (d) {
                         return y(d.y1);
                     })
                     .attr("height", function (d) {
                         return y(d.y0) - y(d.y1);
                     })
                    .style("fill", function (d) {
                        return obj.twoDimensionColorObj[d.stackName][d.groupName];
                    });

                var tip = d3.tip()
                            .attr('class', 'd3-tip')
                            .offset([0, 10])
                            .html(
                            obj.tipTextCallBack || function (_rect) {
                                return "<strong>" + _rect.stackName + "</strong> <span style='color:red'>" + (_rect.Value) + "</span>";
                            });

                svg.call(tip);

                svg.selectAll('g.g').selectAll('rect')
                    .on('mouseover', tip.show)
                      .on('mouseout', tip.hide);

                return svg;
            },
            createAxisCallback: function () {
                var obj = this.obj,
					spacing = obj.spacing,
					categoryField = obj.categoryField,
					showLegend = obj.showLegend,
					width = obj.width,
					height = obj.height,
					data = obj.data,
					yAxisList = obj.yAxisList,
					ys = [];
                var x0 = d3.scale.ordinal()
					.rangeRoundBands([0, width], spacing || 0.1);

                var x1 = d3.scale.ordinal();

                for (var j = 0; j < yAxisList.length; j++) {
                    for (var i = 0; i < showLegend.length; i++) {
                        if (yAxisList[j]["yTarget"] == "All" || yAxisList[j]["yTarget"] == showLegend[i]) {
                            var y = d3.scale.linear()
                                .range([height, 0])
                                .domain([yAxisList[j]["yPoint"] || 0, yAxisList[j]["yTarget"] == "All" ?
                                d3.max(data, function (d) {
                                    return d3.max(d.ages, function (d) {
                                        return d.value;
                                    });
                                }) :
                                d3.max(data, function (d) {
                                    return d3.max(d.ages, function (d) {
                                        if (yAxisList[j]["yTarget"] == d["name"]) {
                                            return d.value;
                                        } else {
                                            return 0;
                                        }
                                    });
                                })
                                ]).nice();
                            ys.push({
                                y: y,
                                yTarget: yAxisList[j].yTarget,
                                yPoint: yAxisList[j].yPoint,
                                yText: yAxisList[j].yText,
                                yFormat: yAxisList[j].yFormat,
                                yAside: yAxisList[j].yAside,
                                yHeader: yAxisList[j].yHeader,
                                yNumber: yAxisList[j].yNumber
                            });
                            break;
                        }
                    }
                }

                x0.domain(data.map(function (d) { return d[categoryField]; }));
                x1.domain(showLegend).rangeRoundBands([0, x0.rangeBand()]);

                return { x0: x0, x1: x1, ys: ys };
            },
            createRotateAxisCallback: function () {
                var obj = this.obj,
					spacing = obj.spacing,
					categoryField = obj.categoryField,
					showLegend = obj.showLegend,
					width = obj.width,
					height = obj.height,
					data = obj.data,
					yAxisList = obj.yAxisList,
					ys = [];
                var x0 = d3.scale.ordinal()
					.rangeRoundBands([0, height], spacing || 0.1);

                var x1 = d3.scale.ordinal();

                for (var j = 0; j < yAxisList.length; j++) {
                    for (var i = 0; i < showLegend.length; i++) {
                        if (yAxisList[j]["yTarget"] == "All" || yAxisList[j]["yTarget"] == showLegend[i]) {
                            var y = d3.scale.linear()
                                .range([width, 0])
                                .domain([yAxisList[j]["yTarget"] == "All" ?
                                d3.max(data, function (d) {
                                    return d3.max(d.ages, function (d) {
                                        return d.value;
                                    });
                                }) :
                                d3.max(data, function (d) {
                                    return d3.max(d.ages, function (d) {
                                        if (yAxisList[j]["yTarget"] == d["name"]) {
                                            return d.value;
                                        } else {
                                            return 0;
                                        }
                                    });
                                })
                                , yAxisList[j]["yPoint"] || 0]).nice();
                            ys.push({
                                y: y,
                                yTarget: yAxisList[j].yTarget,
                                yPoint: yAxisList[j].yPoint,
                                yText: yAxisList[j].yText,
                                yFormat: yAxisList[j].yFormat,
                                yAside: yAxisList[j].yAside,
                                yHeader: yAxisList[j].yHeader,
                                yNumber: yAxisList[j].yNumber
                            });
                            break;
                        }
                    }
                }
                x0.domain(data.map(function (d) { return d[categoryField]; }));
                x1.domain(showLegend).rangeRoundBands([0, x0.rangeBand()]);
                return { x0: x0, x1: x1, ys: ys };
            },
            createAxis: function (axisCallback) {
                var obj = this.obj,
					height = obj.height,
					width = obj.width,
					graticule = obj.graticule,
					yAxisList = obj.yAxisList,
					yAxies = [];
                var xAxis = d3.svg.axis()
					.scale(axisCallback.x0)
					.orient("bottom");
                for (var ys = axisCallback.ys, dirJudge = 0, i = 0; i < ys.length; i++, dirJudge++) {
                    var yAxis = d3.svg.axis()
						.scale(ys[i]["y"])
                    if (dirJudge % 2) {
                        yAxis.orient("right");
                    } else {
                        yAxis.orient("left");
                    }

                    if (graticule == "reseau") {
                        xAxis.tickSize(-height);
                        yAxis.tickSize(-width);
                    }
                    if (ys[i].yFormat) {
                        yAxis.tickFormat((Object.prototype.toString.call(ys[i].yFormat) === "[object Function]") ? ys[i].yFormat : (d3.format(ys[i].yFormat)));
                    }
                    if (ys[i].yNumber || ys[i].yNumber == 0) {
                        yAxis.ticks(ys[i].yNumber);
                    }
                    yAxies.push({
                        yAxis: yAxis, yTarget: ys[i].yTarget,
                        yPoint: ys[i].yPoint,
                        yText: ys[i].yText,
                        yFormat: ys[i].yFormat,
                        yAside: ys[i].yAside,
                        yHeader: ys[i].yHeader,
                        yNumber: ys[i].yNumber
                    });
                }
                return { xAxis: xAxis, yAxies: yAxies };
            },
            createRotateAxis: function (axisCallback) {
                var obj = this.obj,
					yFormat = obj.yFormat,
					height = obj.height,
					width = obj.width,
					graticule = obj.graticule,
					yAxisList = obj.yAxisList,
					xAxies = [];
                var yAxis = d3.svg.axis()
                .scale(axisCallback.x0)
                .orient("left");
                for (var ys = axisCallback.ys, dirJudge = 0, i = 0; i < ys.length; i++, dirJudge++) {
                    var xAxis = d3.svg.axis()
                        .scale(ys[i]["y"])
                    if (dirJudge % 2) {
                        xAxis.orient("top");
                    } else {
                        xAxis.orient("bottom");
                    }

                    if (graticule == "reseau") {
                        xAxis.tickSize(-height);
                        yAxis.tickSize(-width);
                    }
                    if (ys[i].yFormat) {
                        xAxis.tickFormat((Object.prototype.toString.call(ys[i].yFormat) === "[object Function]") ? ys[i].yFormat : (d3.format(ys[i].yFormat)));
                    }
                    if (ys[i].yNumber || ys[i].yNumber == 0) {
                        xAxis.ticks(ys[i].yNumber);
                    }
                    xAxies.push({
                        xAxis: xAxis,
                        yTarget: ys[i].yTarget,
                        yPoint: ys[i].yPoint,
                        yText: ys[i].yText,
                        yFormat: ys[i].yFormat,
                        yAside: ys[i].yAside,
                        yHeader: ys[i].yHeader,
                        yNumber: ys[i].yNumber
                    });
                }
                return { xAxies: xAxies, yAxis: yAxis };
            },
            createTip: function () {
                var obj = this.obj,
					tipTextCallBack = obj.tipTextCallBack,
					fontFamily = obj.fontFamily,
					fontSize = obj.fontSize;
                var tip = d3.tip()
				  .attr('class', 'd3-tip')
                  .style("font-family", fontFamily)
                  .style("font-size", fontSize)
				  .offset([-10, 0])
				  .html(function (d) {
				      return tipTextCallBack(d);
				  })
                return tip;
            },
            drawSvg: function () {
                var obj = this.obj,
					width = obj.width,
					height = obj.height,
					margin = obj.margin,
					selector = obj.selector,
					svg = d3.select(selector).html("").append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				  .append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                return svg;
            },
            drawTitle: function (svg) {
                var obj = this.obj,
					width = obj.width,
					title = obj.title,
					fontFamily = obj.fontFamily,
					fontSize = obj.fontSize;
                svg.append("text")
                    .attr("class", "svgTitle")
                    .style("font-family", fontFamily)
                    .attr("transform", "translate(" + width / 2 + ",-10)")
                    .style("font-weight", "bold")
                    .style("font-size", fontSize)
                    .style("text-anchor", "middle")
                    .text(title);
            },
            drawAxis: function (svg, axis) {
                var obj = this.obj,
					width = obj.width,
					xText = obj.xText,
					height = obj.height,
					xAside = obj.xAside,
					xHeader = obj.xHeader,
					fontFamily = obj.fontFamily,
					xAxisInterval = obj.xAxisInterval,
					margin = obj.margin,
					color = obj.color,
					xAxisNumber = 0;
                if (axis.xAxis) {
                    var XAxis = svg.append("g")
                  .attr("class", "x axis")
                  .attr("transform", "translate(0," + height + ")")
                    .style("font-family", fontFamily)
                  .call(axis.xAxis);

                    XAxis.append("text")
                     .attr("x", width)
                     .attr("y", 35)
                     .attr("dy", ".71em")
                     .style("text-anchor", "end")
                       .text(xAside || xText || "");
                    XAxis.append("text")
                     .attr("x", width / 2)
                     .attr("y", 42)
                     .attr("font-weight", "bold")
                     .attr("dy", ".71em")
                     .style("text-anchor", "middle")
                       .text(xHeader || "");
                    XAxis.selectAll("line").style("stroke", "#c1c1c1");
                } else if (axis.xAxies) {
                    for (var xAxies = axis.xAxies, flag = 0, i = 0; i < xAxies.length; i++) {
                        flag = i % 2;
                        var XAxis = svg.append("g")
                          .attr("class", "x axis")
                          .attr("transform", flag ? "translate(0,0)" : "translate(0," + height + ")")
                            .style("font-family", fontFamily)
                          .call(xAxies[i]["xAxis"]);

                        XAxis.append("text")
                         .attr("x", width)
                         .attr("y", flag ? -35 : 35)
                         .attr("dy", ".71em")
                         .style("text-anchor", "end")
                           .text(xAside || xText || "");
                        XAxis.append("text")
                         .attr("x", width / 2)
                         .attr("y", flag ? -42 : 42)
                         .attr("font-weight", "bold")
                         .attr("dy", ".71em")
                         .style("text-anchor", "middle")
                           .text(xHeader || "");
                        XAxis.selectAll("line").style("stroke", "#c1c1c1");
                    }
                }
                if (axis.yAxis) {
                    var YAxis = svg.append("g")
                        .attr("class", "y axis")
                        .style("font-family", fontFamily)
                        .call(axis.yAxis);
                    YAxis.append("text")
                        .attr("class", "text")
                        .attr("y", -15)
                        .attr("x", 0)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(axis.yAxis.yAside || axis.yAxis.yText || "");
                    YAxis.append("text")
                        .attr("class", "header")
                        .attr("transform", "rotate(-90)")
                        .attr("x", -height / 2)
                        .attr("y", -90)
                        .attr("font-weight", "bold")
                        .attr("dy", ".71em")
                        .style("text-anchor", "middle")
                        .text(axis.yAxis.yHeader || "");
                    YAxis.selectAll("line").style("stroke", "#c1c1c1");
                } else if (axis.yAxies) {
                    for (var yAxies = axis.yAxies, flag = 0, i = 0; i < yAxies.length; i++) {
                        flag = i % 2;
                        var YAxis = svg.append("g")
                            .attr("class", "y axis")
                            .attr("transform", flag ? "translate(" + width + ",0)" : "translate(0,0)")
                            .style("fill", yAxies[i]["yTarget"] == "All" ? "#000" : color(yAxies[i]["yTarget"]))
                            .style("font-family", fontFamily)
                            .call(yAxies[i]["yAxis"]);
                        YAxis.append("text")
                            .attr("y", -15)
                            .attr("class", "text")
                            .attr("x", 0)
                            .attr("dy", ".71em")
                            .style("text-anchor", flag ? "start" : "end")
                            .style("fill", "#000")
                            .text(yAxies[i].yAside || yAxies[i].yText || "");
                        YAxis.append("text")
                            .attr("class", "header")
                            .attr("transform", flag ? "rotate(90)" : "rotate(-90)")
                            .attr("x", flag ? height / 2 : -height / 2)
                            .attr("y", -90)
                            .attr("font-weight", "bold")
                            .attr("dy", ".71em")
                            .style("text-anchor", "middle")
                            .style("fill", "#000")
                            .text(yAxies[i].yHeader || "");
                        YAxis.selectAll("line").style("stroke", "#c1c1c1");
                    }
                }
                /**/
                svg.selectAll(".y.axis").each(function () {
                    var maxYTextLength = d3.max(d3.select(this).selectAll(".tick")[0], function (d) {
                        return d.getBoundingClientRect().width;
                    });
                    var header = d3.select(this).select(".header");
                    var y = parseInt(header.attr("y"));
                    if (y > 0) {
                        header.attr("y", maxYTextLength + 30);
                    } else {
                        header.attr("y", -(maxYTextLength + 30));
                    }
                });
                /**/
                if (obj.optimize) {
                    this.xAxisOptimize(svg);
                }
            },
            xAxisOptimize: function (svg) {
                var obj = this.obj,
				optimize = obj.optimize;
                var _xaxis = svg.selectAll(".x.axis path")[0][0] && svg.selectAll(".x.axis path")[0][0].getBoundingClientRect().width || undefined;
                if (!_xaxis) {
                    return;
                }
                var maxXTextLength = d3.max(svg.selectAll(".x.axis .tick")[0], function (d) {
                    return d.getBoundingClientRect().width;
                });

                var displayNumbers = parseInt(_xaxis / maxXTextLength);
                var actualNumbers = svg.selectAll(".x.axis .tick text")[0].length;
                if (displayNumbers < actualNumbers) {
                    if (optimize == "rotate") {
                        svg.selectAll(".x.axis .tick text")[0].forEach(function (element, index) {
                            d3.select(element).attr("transform", "rotate(-30)").style("text-anchor", "end");
                        });
                    } else if (optimize == "staggered") {
                        var num = 0;
                        svg.selectAll(".x.axis .tick text")[0].forEach(function (element, index) {
                            if (num % 2) {
                                d3.select(element).attr("y", parseInt(d3.select(element).attr("y")) + 13);
                            }
                            num++;
                        });
                    } else if (optimize = "interval") {
                        //是每几个就隐藏（而不每隔几个）
                        var hideEvery = Math.ceil(actualNumbers / displayNumbers);

                        svg.selectAll(".x.axis .tick text")[0].forEach(function (element, index) {
                            if (index % hideEvery != 0)
                                d3.select(element).text("");
                        });

                    }
                }
            },
            drawBar: function (svg, axisCallback, tip) {
                var obj = this.obj,
					data = obj.data,
					categoryField = obj.categoryField,
					group = obj.group,
					height = obj.height,
					color = obj.color,
					ys = axisCallback.ys;
                var state = svg.selectAll(".state")
					  .data(data)
					.enter().append("g")
					  .attr("class", "g")
					  .attr("transform", function (d) { return "translate(" + axisCallback.x0(d[categoryField]) + ",0)"; });
                svg.call(tip);
                var bars = state.selectAll("rect")
                    .data(function (d) { return d.ages; })
                  .enter();
                for (var i = 0, len = ys.length; i < len; i++) {
                    bars.append("rect")
                        .attr("width", axisCallback.x1.rangeBand())
                        .attr("x", function (d) { if (ys[i]["yTarget"] == "All" || ys[i]["yTarget"] == d.name) { return axisCallback.x1(d.name) } })
                        .attr("y", function (d) { if (ys[i]["yTarget"] == "All" || ys[i]["yTarget"] == d.name) { return ys[i]["y"](d.value); } })
                        .attr("height", function (d) { if (ys[i]["yTarget"] == "All" || ys[i]["yTarget"] == d.name) { return height - ys[i]["y"](d.value); } })
                        .style("fill", function (d) {
                            if (ys[i]["yTarget"]) { return color(group ? d.name : d.category); }
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);

                }
                return svg;
            },
            drawRotateBar: function (svg, axisCallback, tip) {
                var obj = this.obj,
					data = obj.data,
					categoryField = obj.categoryField,
					group = obj.group,
					height = obj.height,
					color = obj.color,
					ys = axisCallback.ys;
                var state = svg.selectAll(".state")
					  .data(data)
					.enter().append("g")
					  .attr("class", "g")
					  .attr("transform", function (d) {
					      return "translate(0," + axisCallback.x0(d[categoryField]) + ")";
					  });
                svg.call(tip);

                var bars = state.selectAll("rect")
                    .data(function (d) { return d.ages; })
                  .enter();
                for (var i = 0, len = ys.length; i < len; i++) {
                    bars.append("rect")
					  .attr("width", function (d) { if (ys[i]["yTarget"] == "All" || ys[i]["yTarget"] == d.name) { return ys[i]["y"](d.value); } })
					  .attr("x", 0)
					  .attr("y", function (d) { if (ys[i]["yTarget"] == "All" || ys[i]["yTarget"] == d.name) { return axisCallback.x1(d.name); } })
					  .attr("height", axisCallback.x1.rangeBand())
					  .style("fill", function (d) {
					      if (ys[i]["yTarget"] == "All" || ys[i]["yTarget"] == d.name) { return color(group ? d.name : d.category); }
					  })
					  .on('mouseover', tip.show)
					  .on('mouseout', tip.hide);
                }
                return svg;
            },
            createLegend: function (svg) {
                var _this = this,
					obj = _this.obj,
					height = obj.height,
					margin = obj.margin,
					width = obj.width,
					showLegend = obj.showLegend,
				legend = svg.selectAll(".legend")
					.data(obj.showNames.slice())
					.enter().append("g")
					.attr("class", "legend")
					.attr("transform", function (d, i) { return "translate(0," + (height + 50) + ")"; });
                legend.append("rect")
					.attr("class", "showFlag")
					.attr("x", 0)
					.attr("width", 18)
					.attr("height", 18)
					.attr("keyWord", function (d) {
					    return d;
					})
					.attr("showflags", function (d) {
					    for (var i = 0, len = showLegend.length; i < len; i++) {
					        if (showLegend[i] === d) {
					            return "true";
					        }
					    }
					    return "false";
					})
					.style("fill", function (d) {
					    for (var i = 0, len = showLegend.length; i < len; i++) {
					        if (showLegend[i] === d) {
					            return obj.color.apply(this, arguments);
					        }
					    }
					    return "#b2b2b2";
					}).on("click", function () {
					    var showFlag = d3.select(this), showLegend = [];
					    if (showFlag.attr("showflags") === "true") {
					        showFlag.attr("showflags", "false");
					    } else {
					        showFlag.attr("showflags", "true");
					    }
					    svg.selectAll(".showFlag").each(function () {
					        if (d3.select(this).attr("showflags") === "true") {
					            showLegend.push(d3.select(this).attr("keyWord"));
					        }
					    });
					    _this.obj.showLegend = showLegend;
					    _this[_this["chartType"]]();
					});

                legend.append("text")
					.attr("x", 22)
					.attr("y", 9)
					.attr("dy", ".35em")
					.style("font-family", obj.fontFamily)
					.attr("text-anchor", "start")
					.text(function (d) { return d; });
                var left = 0, line = 0;
                svg.selectAll(".legend").each(function () {
                    (left + this.getBoundingClientRect().width) > width ? (left = 0, line++) : "";
                    d3.select(this).attr("transform", function (d, i) { return "translate(" + left + "," + (height + 53 + line * 22) + ")"; });
                    left += this.getBoundingClientRect().width + 15;
                });
            },
            createTwoDimensionLegend: function (svg) {
                var _this = this,
					obj = _this.obj,
					height = obj.height,
					margin = obj.margin,
					width = obj.width;
                obj.legends = obj.legends || this.convertDataToLegends({ type: "stackedGroup", data: obj.rawData, categoryField: obj.categoryField });
                obj.displayedLegend = obj.displayedLegend || clone(obj.legends);

                //stack legends
                legend = svg.selectAll(".legendStack")
					.data(Object.keys(_this.obj.legends.stackObj))
					.enter().append("g")
					.attr("class", "legendStack")
					.attr("transform", function (d, i) { return "translate(0," + (height + 50) + ")"; });
                legend
                    .append("linearGradient")
                    .attr("class", "rectStackDef")
                    .attr("id", function (d) {
                        return "linearGradient_" + (_this.UID || "") + "_stack_id_" + d;
                    });



                for (var i = 0 ; i < obj.groupNames.length ; i++) {
                    legend.selectAll(".rectStackDef")
                    .append("stop")
                    .attr("offset", ((i) * 100 / obj.groupNames.length).toFixed(2) + "%")
			        .attr("stop-color", function (d) {
			            return obj.twoDimensionColorObj.stack[d][i];
			        });
                    legend.selectAll(".rectStackDef")
                    .append("stop")
                    .attr("offset", ((i + 1) * 100 / obj.groupNames.length).toFixed(2) + "%")
			        .attr("stop-color", function (d) {
			            return obj.twoDimensionColorObj.stack[d][i];
			        });
                }


                legend
                    .append("rect")
					.attr("class", "showFlag")
					.attr("x", 0)
					.attr("width", 18)
					.attr("height", 18)
					.attr("keyWord", function (d) {
					    return d;
					})
					.attr("showflags", function (d) {

					    if (_this.obj.displayedLegend.stackObj[d] === undefined) {
					        return "false";
					    }

					    return "true";
					})
					.attr("style", function (d) {

					    if (_this.obj.displayedLegend.stackObj[d] === undefined) {
					        return "#b2b2b2";
					    }

					    return "fill:url(#linearGradient_" + (_this.UID || "") + "_stack_id_" + d + ")";
					}).on("click", function () {
					    var showFlag = d3.select(this), displayedStackObj = {};
					    if (showFlag.attr("showflags") === "true") {
					        showFlag.attr("showflags", "false");
					    } else {
					        showFlag.attr("showflags", "true");
					    }
					    svg.selectAll(".legendStack .showFlag").each(function () {
					        if (d3.select(this).attr("showflags") === "true") {
					            displayedStackObj[d3.select(this).attr("keyWord")] = "";
					        }
					    });
					    _this.obj.displayedLegend.stackObj = displayedStackObj;
					    _this[_this["chartType"]]();
					});

                legend.append("text")
					.attr("x", 22)
					.attr("y", 9)
					.attr("dy", ".35em")
					.style("font-family", obj.fontFamily)
					.attr("text-anchor", "start")
					.text(function (d) { return d; });
                var left = 0, line = 0;
                svg.selectAll(".legendStack").each(function () {
                    (left + this.getBoundingClientRect().width) > width ? (left = 0, line++) : "";
                    d3.select(this).attr("transform", function (d, i) { return "translate(" + left + "," + (height + 53 + line * 22) + ")"; });
                    left += this.getBoundingClientRect().width + 15;
                });

                //group legends
                legend = svg.selectAll(".legendGroup")
					.data(Object.keys(_this.obj.legends.groupObj))
					.enter().append("g")
					.attr("class", "legendGroup")
					.attr("transform", function (d, i) { return "translate(0," + (height + 50 + 50) + ")"; });
                legend
                    .append("linearGradient")
                    .attr("class", "rectGroupDef")
                    .attr("id", function (d) {
                        return "linearGradient_" + (_this.UID || "") + "_group_id_" + d;
                    });

                for (var i = 0 ; i < obj.stackNames.length ; i++) {
                    legend.selectAll(".rectGroupDef")
                    .append("stop")
                    .attr("offset", ((i) * 100 / obj.stackNames.length).toFixed(2) + "%")
			        .attr("stop-color", function (d) {
			            return obj.twoDimensionColorObj.group[d][i];
			        });
                    legend.selectAll(".rectGroupDef")
                    .append("stop")
                    .attr("offset", ((i + 1) * 100 / obj.stackNames.length).toFixed(2) + "%")
			        .attr("stop-color", function (d) {
			            return obj.twoDimensionColorObj.group[d][i];
			        });
                }


                legend
                    .append("rect")
					.attr("class", "showFlag")
					.attr("x", 0)
					.attr("width", 18)
					.attr("height", 18)
					.attr("keyWord", function (d) {
					    return d;
					})
					.attr("showflags", function (d) {

					    if (_this.obj.displayedLegend.groupObj[d] === undefined) {
					        return "false";
					    }

					    return "true";
					})
					.attr("style", function (d) {

					    if (_this.obj.displayedLegend.groupObj[d] === undefined) {
					        return "#b2b2b2";
					    }

					    return "fill:url(#linearGradient_" + (_this.UID || "") + "_group_id_" + d + ")";
					}).on("click", function () {
					    var showFlag = d3.select(this), displayedGroupObj = {};
					    if (showFlag.attr("showflags") === "true") {
					        showFlag.attr("showflags", "false");
					    } else {
					        showFlag.attr("showflags", "true");
					    }
					    svg.selectAll(".legendGroup .showFlag").each(function () {
					        if (d3.select(this).attr("showflags") === "true") {
					            displayedGroupObj[d3.select(this).attr("keyWord")] = "";
					        }
					    });
					    _this.obj.displayedLegend.groupObj = displayedGroupObj;
					    _this[_this["chartType"]]();
					});

                legend.append("text")
					.attr("x", 22)
					.attr("y", 9)
					.attr("dy", ".35em")
					.style("font-family", obj.fontFamily)
					.attr("text-anchor", "start")
					.text(function (d) { return d; });
                var left = 0, line = 0;
                svg.selectAll(".legendGroup").each(function () {
                    (left + this.getBoundingClientRect().width) > width ? (left = 0, line++) : "";
                    d3.select(this).attr("transform", function (d, i) { return "translate(" + left + "," + (height + 50 + 53 + line * 22) + ")"; });
                    left += this.getBoundingClientRect().width + 15;
                });
            }

        };
        return createChartDOM;
    })();




    var GroupedLineChart = function () {
        this.dataProvider = null;// *
        this.categoryField = null;// *
        this.DataFormat = null;// defualt
        this.interpolate = "cardinal";//linear,cardinal
        this.yText = "";//defualt is "" 
        this.color = null;
        this.left = 50;
        this.right = 100;
        this.bottom = 30;
        this.top = 20;
        this.width = 960;
        this.height = 500;
        this.yFormat = null;
        this.yOffset = 0;
        this.yPoint = null;
        this.fontFamily = "arial";
        this.fontSize = "13px";
        this.tipTextCallBack = function (d, color) {
            return "<span style='color:" + color(d.name) + "'>" + d.y + "</span>";
        }
        this.title = "";// *
    }

    GroupedLineChart.prototype =
	{
	    write: (function () {
	        if (!-[1, ]) {
	            return function (selector) {
	                document.getElementById((selector).replace("#", "")).innerHTML = "Your Internet Explorer browser version is lower than 9.0, please update to the latest version.";
	            }
	        } else {
	            return function (selector) {
	                var margin = { top: this.top || 20, right: this.right || 30, bottom: this.bottom || 30, left: this.left || 30 },
                        width = this.width - margin.left - margin.right,
                        height = this.height > 60 ? this.height - margin.top - margin.bottom : 60 - margin.top - margin.bottom,
						fontFamily = this.fontFamily,
						fontSize = this.fontSize,
						graticule = this.graticule,
						yNumber = this.yNumber;
	                yAxisList = this.yAxisList;
	                var data = this.dataProvider,
                    tipTextCallBack = this.tipTextCallBack;//data 
	                var color = this.color ? d3.scale.ordinal().range(this.color) : d3.scale.category10();

	                var categoryField = this.categoryField;
	                yAxisList = yAxisList && yAxisList.length ? yAxisList : [{
	                    yTarget: "All",
	                    yText: this.yText,
	                    yOffset: this.yOffset,
	                    yFormat: this.yFormat,
	                    yOffset: this.yOffset,
	                    yPoint: this.yPoint,
	                    yNumber: this.yNumber
	                }];
	                color.domain(d3.keys(data[0]).filter(function (key) { return key !== categoryField; }));
	                this.showLegend = this.showLegend || d3.keys(data[0]).filter(function (key) { return key !== categoryField; });

	                //this.DataFormat ? data.forEach(this.DataFormat) : null;

	                var objects = this.showLegend.map(function (name) {
	                    return {
	                        name: name,
	                        values: data.map(function (d) {
	                            return { x: d[categoryField], y: +d[name], name: name };// + is numeric format
	                        })
	                    };
	                });
	                var x = d3.scale.ordinal()
                        .rangeRoundBands([0, width]);

	                x.domain(data.map(function (d) { return d[categoryField]; }));
	                var ys = [];
	                for (var i = 0, len = yAxisList.length; i < len; i++) {
	                    for (var j = 0; j < this.showLegend.length; j++) {
	                        if (yAxisList[i]["yTarget"] == "All" || yAxisList[i]["yTarget"] == this.showLegend[j]) {
	                            var y = d3.scale.linear()
									.range([height, 0]);
	                            var domain = [
								  (yAxisList[i].yPoint || yAxisList[i].yPoint == 0) ? yAxisList[i].yPoint : 0,
								  d3.max(objects, function (c) {
								      if (c.name == yAxisList[i]["yTarget"] || yAxisList[i]["yTarget"] == "All") {
								          return d3.max(c.values, function (v) { return v.y; });

								      }
								  })
	                            ];
	                            y.domain(domain).nice();
	                            if (yAxisList[i].yNumber) {
	                                y.ticks(yAxisList[i].yNumber);
	                            }
	                            ys.push({
	                                y: y,
	                                yTarget: yAxisList[i].yTarget,
	                                yText: yAxisList[i].yText,
	                                yFormat: yAxisList[i].yFormat,
	                                yOffset: yAxisList[i].yOffset,
	                                yPoint: yAxisList[i].yPoint,
	                                yNumber: yAxisList[i].yNumber,
	                                yHeader: yAxisList[i].yHeader
	                            });
	                            break;
	                        }
	                    }
	                }
	                var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom");
	                if (graticule == "reseau") {
	                    xAxis.tickSize(-height);
	                }
	                var yAxies = [];

	                for (var i = 0, flag = 0; i < ys.length; i++) {
	                    flag = i % 2;
	                    var yAxis = d3.svg.axis()
							.scale(ys[i]["y"]);
	                    if (flag) {
	                        yAxis.orient("right");
	                    } else {
	                        yAxis.orient("left");
	                    }
	                    if (graticule == "reseau") {
	                        yAxis.tickSize(-width);
	                    }
	                    if (ys[i].yFormat) {
	                        yAxis.tickFormat((Object.prototype.toString.call(ys[i].yFormat) === "[object Function]") ? ys[i].yFormat : (d3.format(ys[i].yFormat)));
	                    }
	                    if (ys[i].yNumber || ys[i].yNumber == 0) {
	                        yAxis.ticks(ys[i].yNumber);
	                    }
	                    yAxies.push({
	                        yAxis: yAxis,
	                        yTarget: ys[i].yTarget,
	                        yText: ys[i].yText,
	                        yFormat: ys[i].yFormat,
	                        yOffset: ys[i].yOffset,
	                        yPoint: ys[i].yPoint,
	                        yNumber: ys[i].yNumber,
	                        yHeader: ys[i].yHeader
	                    });
	                }

	                var line = d3.svg.line()
                        .interpolate(this.interpolate)
                        .x(function (d) { return x(d.x); })
                        .y(function (d) { return y(d.y); });

	                var svg = d3.select(selector).html("").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	                svg.append("text")
                        .attr("transform", function (d) { return "translate(" + width / 2 + ",-10)"; })
						.style("font-family", fontFamily)
                        .style("font-weight", "bold")
                        .style("font-size", fontSize)
                        .style("text-anchor", "middle")
                        .text(this.title);



	                var tip = d3.tip()
                      .attr('class', 'd3-tip')
					  .style("font-family", fontFamily)
					  .style("font-size", fontSize)
                      .offset([-10, 0])
                      .html(function (d) {
                          return tipTextCallBack(d, color);
                      })

	                svg.call(tip);


	                var XAxis = svg.append("g")
                        .attr("class", "x axis")
						.style("font-family", fontFamily)
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);
	                XAxis.append("text")
                     .attr("x", width)
                     .attr("y", 35)
                     .attr("dy", ".71em")
                     .style("text-anchor", "end")
                       .text(this.xAside || this.xText || "");
	                XAxis.append("text")
                      .attr("x", width / 2)
                      .attr("y", 42)
                      .attr("font-weight", "bold")
                      .attr("dy", ".71em")
                      .style("text-anchor", "middle")
                      .text(this.xHeader || "");
	                XAxis.selectAll("line").style("stroke", "#c1c1c1");
	                for (var i = 0, flag = i % 2, len = yAxies.length; i < len; i++) {
	                    flag = i % 2;
	                    var YAxis = svg.append("g")
							.attr("class", "y axis")
							  .attr("transform", flag ? "translate(" + width + ",0)" : "translate(0,0)")
							  .style("fill", yAxies[i]["yTarget"] == "All" ? "#000" : color(yAxies[i]["yTarget"]))
							.style("font-family", fontFamily)
							.call(yAxies[i]["yAxis"]);
	                    YAxis.append("text")
                          .attr("class", "text")
                          .style("fill", "#000")
                          .attr("y", -15)
                          .attr("x", 0)
                          .attr("dy", ".71em")
                          .style("text-anchor", flag ? "start" : "end")
                        .text(yAxies[i].yAside || yAxies[i].yText || "");
	                    YAxis.append("text")
                         .style("fill", "#000")
                         .attr("class", "header")
                         .attr("transform", flag ? "rotate(90)" : "rotate(-90)")
                         .attr("x", flag ? height / 2 : -height / 2)
                         .attr("y", -90)
                         .attr("font-weight", "bold")
                         .attr("dy", ".71em")
                         .style("text-anchor", "middle")
                       .text(yAxies[i].yHeader || "");

	                    YAxis.selectAll("line").style("stroke", "#c1c1c1");
	                }

	                /**/
	                svg.selectAll(".y.axis").each(function () {
	                    var maxYTextLength = d3.max(d3.select(this).selectAll(".tick")[0], function (d) {
	                        return d.getBoundingClientRect().width;
	                    });
	                    var header = d3.select(this).select(".header");
	                    var y = parseInt(header.attr("y"));
	                    if (y > 0) {
	                        header.attr("y", maxYTextLength + 30);
	                    } else {
	                        header.attr("y", -(maxYTextLength + 30));
	                    }
	                });
	                /**/


	                if (this.optimize) {
	                    optimize = this.optimize;
	                    var _xaxis = svg.selectAll(".x.axis path")[0][0].getBoundingClientRect().width;
	                    var maxXTextLength = d3.max(svg.selectAll(".x.axis .tick")[0], function (d) {
	                        return d.getBoundingClientRect().width;
	                    });

	                    var displayNumbers = parseInt(_xaxis / maxXTextLength);
	                    var actualNumbers = svg.selectAll(".x.axis .tick text")[0].length;

	                    var hideEvery = parseInt(actualNumbers / displayNumbers) + 1;
	                    if (displayNumbers < actualNumbers) {
	                        if (optimize == "rotate") {
	                            svg.selectAll(".x.axis .tick text")[0].forEach(function (element, index) {
	                                d3.select(element).attr("transform", "rotate(-30)").style("text-anchor", "end");
	                            });
	                        } else if (optimize == "staggered") {
	                            var num = 0;
	                            svg.selectAll(".x.axis .tick text")[0].forEach(function (element, index) {
	                                if (num % 2) {
	                                    d3.select(element).attr("y", parseInt(d3.select(element).attr("y")) + 13);
	                                }
	                                num++;
	                            });
	                        } else if (optimize = "interval") {
	                            //是每几个就隐藏（而不每隔几个）
	                            var hideEvery = Math.ceil(actualNumbers / displayNumbers);

	                            svg.selectAll(".x.axis .tick text")[0].forEach(function (element, index) {
	                                if (index % hideEvery != 0)
	                                    d3.select(element).text("");
	                            });

	                        }
	                    }
	                }
	                var objectOuter = svg.selectAll(".object");

	                for (var i = 0, len1 = ys.length; i < len1; i++) {
	                    var cloneObjects = [];
	                    for (var k = 0, len2 = objects.length; k < len2; k++) {
	                        if (objects[k]["name"] == ys[i]["yTarget"] || ys[i]["yTarget"] == "All") {
	                            cloneObjects.push(objects[k]);
	                        }
	                    }
	                    var objectOuter = svg.selectAll(".object" + i).data(cloneObjects).enter();
	                    var object = objectOuter.append("g")
							.attr("class", "object" + i)
							.attr("transform", function (d) { return "translate(" + x.rangeBand() / 2 + ",0)"; });

	                    var lines = object.selectAll(".circle")
                            .data(function (d) { return d.values; })
                            .enter();

	                    var yTarget = ys[i]["yTarget"];
	                    var line = d3.svg.line()
                            .interpolate(this.interpolate)
                            .x(function (d) { return x(d.x); })
                            .y(function (d) {
                                return ys[i]["y"](d.y);
                            });
	                    object.append("path")
                            .attr("class", "line")
                            .attr("d", function (d) {
                                return line(d.values);
                            })
                            .style("fill", "none")
                            .style("stroke-width", "1.5px")
                            .style("stroke", function (d) {
                                return color(d.name);
                            });
	                    //object.append("text")
	                    //    .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; })
	                    //    .attr("transform", function (d) { return "translate(" + x(d.value.x) + "," + y(d.value.y) + ")"; })
	                    //    .attr("x", 5)
	                    //    .attr("dy", ".35em")
	                    //    .text(function (d) { return d.name; });

	                    lines.append("circle")
                            .attr("class", "circle")
                            .attr("cx", function (d) {
                                return x(d.x);
                            })
                            .attr("cy", function (d) {
                                return ys[i]["y"](d.y);
                            })
                            .attr("r", 4)
                            .attr("fill", function (d) { return color(d.name); })
                            .on('mouseover', tip.show)
                            .on('mouseout', tip.hide);
	                }
	                var _this = this,
					legend = svg.selectAll(".legend")
                        .data(color.domain().slice().reverse())
                        .enter().append("g")
                        .attr("class", "legend")
                        .attr("transform", function (d, i) { return "translate(0," + (height + 50) + ")"; });
	                legend.append("rect")
						.attr("class", "showFlag")
						.attr("x", 0)
                        .attr("width", 18)
                        .attr("height", 18)
                        .style("fill", color)


					.attr("keyWord", function (d) {
					    return d;
					})
					.attr("showflags", function (d) {
					    for (var i = 0, len = _this.showLegend.length; i < len; i++) {
					        if (_this.showLegend[i] === d) {
					            return "true";
					        }
					    }
					    return "false";
					})
					.style("fill", function (d) {
					    for (var i = 0, len = _this.showLegend.length; i < len; i++) {
					        if (_this.showLegend[i] === d) {
					            return color.apply(this, arguments);
					        }
					    }
					    return "#b2b2b2";
					}).on("click", function () {
					    var showFlag = d3.select(this), showLegend = [];
					    if (showFlag.attr("showflags") === "true") {
					        showFlag.attr("showflags", "false");
					    } else {
					        showFlag.attr("showflags", "true");
					    }
					    svg.selectAll(".showFlag").each(function () {
					        if (d3.select(this).attr("showflags") === "true") {
					            showLegend.push(d3.select(this).attr("keyWord"));
					        }
					    });
					    _this.showLegend = showLegend;
					    _this["write"](selector);
					});
	                legend.append("text")
					.attr("x", 22)
					.attr("y", 9)
					.attr("dy", ".35em")
					.style("font-family", fontFamily)
					.attr("text-anchor", "start")
					.text(function (d) { return d; });
	                var left = 0, line = 0;
	                svg.selectAll(".legend").each(function () {
	                    (left + this.getBoundingClientRect().width) > width ? (left = 0, line++) : "";
	                    d3.select(this).attr("transform", function (d, i) { return "translate(" + left + "," + (height + 53 + line * 22) + ")"; });
	                    left += this.getBoundingClientRect().width + 15;
	                });
	            }
	        }
	    })()
	}
    var PieChart = (function () {
        function createChartDOM() {
            this.left = 20;
            this.right = 20;
            this.top = 20;
            this.bottom = 20;
            this.fontFamily = "arial";
            this.fontSize = "12px";
            this.categoryField = "name";
            this.width = 900;
            this.height = 450;
            this.title = "";
        }
        createChartDOM.prototype = {
            write: function (chartType) {
                if (!ParamTest(this, ["selector", "data"])) {
                    return;
                }
                this[chartType]();
            },
            createPieChart: function () {
                var selector = this.selector,
					width = this.width,
					height = this.height,
					data = this.data,
					left = this.left,
					right = this.right,
					top = this.top,
					colors = this.color,
					bottom = this.bottom,
					fontFamily = this.fontFamily;
                fontSize = this.fontSize;
                categoryField = this.categoryField,
                tipTextCallBack = this.tipTextCallBack,
                title = this.title
                valueField = d3.keys(data[0]).filter(function (d) {
                    return d != categoryField;
                })[0];

                var outerSvg = d3.select(selector)
					.append("svg")
					.attr("width", width)
					.attr("height", height)

                var svg = outerSvg.append("g")
                svg.append("g")
					.attr("class", "slices");
                svg.append("g")
					.attr("class", "labels");
                svg.append("g")
					.attr("class", "lines");

                radius = Math.min(width - left - right, height - top - bottom) / 2;

                var pie = d3.layout.pie()
					.sort(null)
					.value(function (d) {
					    return d[valueField];
					});

                var arc = d3.svg.arc()
					.outerRadius(radius * 0.8)
					.innerRadius(radius * 0);

                var outerArc = d3.svg.arc()
					.innerRadius(radius * 0.9)
					.outerRadius(radius * 0.9);

                svg.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

                var key = function (d) { return d.data[categoryField]; };
                var showLegend = data.map(function (d) { return d[categoryField] });
                var color = null
                colors ? color = d3.scale.ordinal().range(colors) : color = d3.scale.category20c();




                /* ------- PIE SLICES -------*/
                var slice = svg.select(".slices").selectAll("path.slice")
                    .data(pie(data), key);

                slice.enter()
                    .insert("path")
                    .style("fill", function (d) { return color(d.data[categoryField]); })
                    .attr("class", "slice");
                slice
                    .transition().duration(1000)
                    .attrTween("d", function (d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function (t) {
                            return arc(interpolate(t));
                        };
                    })

                slice.exit()
                    .remove();
                var sum = 0;
                data.forEach(function (d) {
                    d[valueField] = parseFloat(d[valueField])
                    sum += d[valueField];
                });
                data.forEach(function (d) {
                    d["sum"] = sum;
                });
                /* ------- TEXT LABELS -------*/
                var text = svg.select(".labels").selectAll("text")
                    .data(pie(data), key);


                text.enter()
                    .append("text")
                    .attr("dy", ".35em")
                    .style("font-family", fontFamily)
                    .style("font-size", fontSize)
                    .text(tipTextCallBack || function (d) {
                        return d.data[categoryField] + ": " + d.data[valueField] + " (" + (Math.round((d.data[valueField] / d.data.sum) * 10000) / 100) + "%)";
                    });

                function midAngle(d) {
                    return d.startAngle + (d.endAngle - d.startAngle) / 2;
                }

                text.transition().duration(1000)
                    .attrTween("transform", function (d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function (t) {
                            var d2 = interpolate(t);
                            var pos = outerArc.centroid(d2);
                            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                            return "translate(" + pos + ")";
                        };
                    })
                    .styleTween("text-anchor", function (d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function (t) {
                            var d2 = interpolate(t);
                            return midAngle(d2) < Math.PI ? "start" : "end";
                        };
                    });

                text.exit()
                    .remove();

                /* ------- SLICE TO TEXT POLYLINES -------*/

                var polyline = svg.select(".lines").selectAll("polyline")
                    .data(pie(data), key);

                polyline.enter()
                    .append("polyline")
                    .style("opacity", "0.3")
                    .style("stroke", "black")
                    .style("stroke-width", "2px")
                    .style("fill", "none");

                polyline.transition().duration(1000)
                    .attrTween("points", function (d) {
                        this._current = this._current || d;
                        var interpolate = d3.interpolate(this._current, d);
                        this._current = interpolate(0);
                        return function (t) {
                            var d2 = interpolate(t);
                            var pos = outerArc.centroid(d2);
                            pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                            return [arc.centroid(d2), outerArc.centroid(d2), pos];
                        };
                    });

                polyline.exit()
                    .remove();
                outerSvg.append("text")
                    .attr("class", "svgTitle")
                    .style("font-family", fontFamily)
                    .attr("transform", "translate(" + (width / 2) + ",20)")
                    .style("font-weight", "bold")
                    .style("font-size", fontSize)
                    .style("text-anchor", "middle")
                    .text(title);
            }
        }
        return createChartDOM;
    })();
    return {
        BarChart: BarChart,
        GroupedLineChart: GroupedLineChart,
        PieChart: PieChart
    }
})();