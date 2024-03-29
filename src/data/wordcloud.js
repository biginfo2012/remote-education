/*
 Highcharts JS v8.0.0 (2019-12-10)

 (c) 2016-2019 Highsoft AS
 Authors: Jon Arild Nygard

 License: www.highcharts.com/license
*/
var wordCloud = (function (a) {
  "object" === typeof module && module.exports ? (a["default"] = a, module.exports = a) : "function" === typeof define && define.amd ? define("highcharts/modules/wordcloud", ["highcharts"], function (k) {
    a(k);
    a.Highcharts = k;
    return a
  }) : a("undefined" !== typeof Highcharts ? Highcharts : void 0)
})(function (a) {
  function k(a, e, z, l) {
    a.hasOwnProperty(e) || (a[e] = l.apply(null, z))
  }

  a = a ? a._modules : {};
  k(a, "mixins/draw-point.js", [], function () {
    var a = function (e) {
      var a = this, l = a.graphic, q = e.animatableAttribs, r = e.onComplete, k = e.css, x =
        e.renderer;
      if (a.shouldDraw()) l || (a.graphic = l = x[e.shapeType](e.shapeArgs).add(e.group)), l.css(k).attr(e.attribs).animate(q, e.isNew ? !1 : void 0, r); else if (l) {
        var t = function () {
          a.graphic = l = l.destroy();
          "function" === typeof r && r()
        };
        Object.keys(q).length ? l.animate(q, void 0, function () {
          t()
        }) : t()
      }
    };
    return function (e) {
      (e.attribs = e.attribs || {})["class"] = this.getClassName();
      a.call(this, e)
    }
  });
  k(a, "mixins/polygon.js", [a["parts/Globals.js"], a["parts/Utilities.js"]], function (a, e) {
    var q = e.isArray, l = e.isNumber, k = a.deg2rad,
      r = a.find, C = function (b, c) {
        c = l(c) ? c : 14;
        c = Math.pow(10, c);
        return Math.round(b * c) / c
      }, x = function (b, c) {
        var h = c[0] - b[0];
        b = c[1] - b[1];
        return [[-b, h], [b, -h]]
      }, t = function (b, c) {
        b = b.map(function (b) {
          return b[0] * c[0] + b[1] * c[1]
        });
        return {min: Math.min.apply(this, b), max: Math.max.apply(this, b)}
      }, D = function (b, c) {
        var h = b[0];
        b = b[1];
        var a = k * -c;
        c = Math.cos(a);
        a = Math.sin(a);
        return [C(h * c - b * a), C(h * a + b * c)]
      }, y = function (b, c, a) {
        b = D([b[0] - c[0], b[1] - c[1]], a);
        return [b[0] + c[0], b[1] + c[1]]
      }, A = function (b) {
        var c = b.axes;
        if (!q(c)) {
          c = [];
          var a =
            a = b.concat([b[0]]);
          a.reduce(function (b, a) {
            var h = x(b, a)[0];
            r(c, function (b) {
              return b[0] === h[0] && b[1] === h[1]
            }) || c.push(h);
            return a
          });
          b.axes = c
        }
        return c
      }, E = function (b, c) {
        b = A(b);
        c = A(c);
        return b.concat(c)
      };
    return {
      getBoundingBoxFromPolygon: function (b) {
        return b.reduce(function (b, a) {
          var c = a[0];
          a = a[1];
          b.left = Math.min(c, b.left);
          b.right = Math.max(c, b.right);
          b.bottom = Math.max(a, b.bottom);
          b.top = Math.min(a, b.top);
          return b
        }, {left: Number.MAX_VALUE, right: -Number.MAX_VALUE, bottom: -Number.MAX_VALUE, top: Number.MAX_VALUE})
      },
      getPolygon: function (b, a, h, e, l) {
        var c = [b, a], w = b - h / 2;
        b += h / 2;
        h = a - e / 2;
        a += e / 2;
        return [[w, h], [b, h], [b, a], [w, a]].map(function (b) {
          return y(b, c, -l)
        })
      }, isPolygonsColliding: function (b, a) {
        var c = E(b, a);
        return !r(c, function (c) {
          var e = t(b, c);
          c = t(a, c);
          return !!(c.min > e.max || c.max < e.min)
        })
      }, movePolygon: function (b, a, e) {
        return e.map(function (c) {
          return [c[0] + b, c[1] + a]
        })
      }, rotate2DToOrigin: D, rotate2DToPoint: y
    }
  });
  k(a, "modules/wordcloud.src.js", [a["parts/Globals.js"], a["parts/Utilities.js"], a["mixins/draw-point.js"], a["mixins/polygon.js"]],
    function (a, e, k, l) {
      function q(g, d) {
        var f = !1, b = g.rect, a = g.polygon, c = g.lastCollidedWith, e = function (d) {
          var f = d.rect;
          (f = !(f.left > b.right || f.right < b.left || f.top > b.bottom || f.bottom < b.top)) && (g.rotation % 90 || d.rotation % 90) && (f = F(a, d.polygon));
          return f
        };
        c && ((f = e(c)) || delete g.lastCollidedWith);
        f || (f = !!I(d, function (d) {
          var f = e(d);
          f && (g.lastCollidedWith = d);
          return f
        }));
        return f
      }

      function r(g, d) {
        d = 4 * g;
        var f = Math.ceil((Math.sqrt(d) - 1) / 2), b = 2 * f + 1, a = Math.pow(b, 2), c = !1;
        --b;
        1E4 >= g && ("boolean" === typeof c && d >= a - b && (c = {
          x: f -
            (a - d), y: -f
        }), a -= b, "boolean" === typeof c && d >= a - b && (c = {
          x: -f,
          y: -f + (a - d)
        }), a -= b, "boolean" === typeof c && (c = d >= a - b ? {x: -f + (a - d), y: f} : {
          x: f,
          y: f - (a - d - b)
        }), c.x *= 5, c.y *= 5);
        return c
      }

      function C(g, d, f) {
        var b = 2 * Math.max(Math.abs(f.top), Math.abs(f.bottom));
        f = 2 * Math.max(Math.abs(f.left), Math.abs(f.right));
        return Math.min(0 < f ? 1 / f * g : 1, 0 < b ? 1 / b * d : 1)
      }

      function x(g, d, b) {
        b = b.reduce(function (b, g) {
          g = g.dimensions;
          var d = Math.max(g.width, g.height);
          b.maxHeight = Math.max(b.maxHeight, g.height);
          b.maxWidth = Math.max(b.maxWidth, g.width);
          b.area += d * d;
          return b
        }, {maxHeight: 0, maxWidth: 0, area: 0});
        b = Math.max(b.maxHeight, b.maxWidth, .85 * Math.sqrt(b.area));
        var a = g > d ? g / d : 1;
        g = d > g ? d / g : 1;
        return {width: b * a, height: b * g, ratioX: a, ratioY: g}
      }

      function t(b, d, a, c) {
        var g = !1;
        h(b) && h(d) && h(a) && h(c) && 0 < b && -1 < d && c > a && (g = a + d % b * ((c - a) / (b - 1 || 1)));
        return g
      }

      function D(b, d) {
        var g, a = [];
        for (g = 1; 1E4 > g; g++) a.push(b(g, d));
        return function (b) {
          return 1E4 >= b ? a[b - 1] : !1
        }
      }

      function y(b, d) {
        var g = d.width / 2, a = -(d.height / 2), c = d.height / 2;
        return !(-(d.width / 2) < b.left && g > b.right && a < b.top &&
          c > b.bottom)
      }

      function A(g, d) {
        var a = d.placed, c = d.field, e = d.rectangle, h = d.polygon, l = d.spiral, k = 1, p = {x: 0, y: 0},
          n = g.rect = b({}, e);
        g.polygon = h;
        for (g.rotation = d.rotation; !1 !== p && (q(g, a) || y(n, c));) p = l(k), w(p) && (n.left = e.left + p.x, n.right = e.right + p.x, n.top = e.top + p.y, n.bottom = e.bottom + p.y, g.polygon = L(p.x, p.y, h)), k++;
        return p
      }

      function E(b, a) {
        if (w(b) && w(a)) {
          var g = a.bottom - a.top;
          var d = a.right - a.left;
          a = b.ratioX;
          var c = b.ratioY;
          g = d * a > g * c ? d : g;
          b = z(b, {width: b.width + g * a * 2, height: b.height + g * c * 2})
        }
        return b
      }

      var b = e.extend,
        c = e.isArray, h = e.isNumber, w = e.isObject, z = a.merge;
      e = a.noop;
      var I = a.find, J = l.getBoundingBoxFromPolygon, K = l.getPolygon, F = l.isPolygonsColliding, L = l.movePolygon,
        B = a.Series;
      a.seriesType("wordcloud", "column", {
        allowExtendPlayingField: !0,
        animation: {duration: 500},
        borderWidth: 0,
        clip: !1,
        colorByPoint: !0,
        minFontSize: 1,
        maxFontSize: 25,
        placementStrategy: "center",
        rotation: {from: 0, orientations: 2, to: 90},
        showInLegend: !1,
        spiral: "rectangular",
        style: {fontFamily: "sans-serif", fontWeight: "900", whiteSpace: "nowrap"},
        tooltip: {
          followPointer: !0,
          pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.weight}</b><br/>'
        }
      }, {
        animate: B.prototype.animate,
        animateDrilldown: e,
        animateDrillupFrom: e,
        setClip: e,
        bindAxes: function () {
          var a = {
            endOnTick: !1,
            gridLineWidth: 0,
            lineWidth: 0,
            maxPadding: 0,
            startOnTick: !1,
            title: null,
            tickPositions: []
          };
          B.prototype.bindAxes.call(this);
          b(this.yAxis.options, a);
          b(this.xAxis.options, a)
        },
        pointAttribs: function (b, d) {
          b = a.seriesTypes.column.prototype.pointAttribs.call(this, b, d);
          delete b.stroke;
          delete b["stroke-width"];
          return b
        },
        deriveFontSize: function (b, a, c) {
          b = h(b) ? b : 0;
          a = h(a) ? a : 1;
          c = h(c) ? c : 1;
          return Math.floor(Math.max(c, b * a))
        },
        drawPoints: function () {
          var a = this, d = a.hasRendered, c = a.xAxis, e = a.yAxis, l = a.group, k = a.options, r = k.animation,
            t = k.allowExtendPlayingField, p = a.chart.renderer, n = p.text().add(l), q = [],
            y = a.placementStrategy[k.placementStrategy], z = k.rotation, F = a.points.map(function (b) {
              return b.weight
            }), B = Math.max.apply(null, F), G = a.points.sort(function (b, a) {
              return a.weight - b.weight
            });
          G.forEach(function (c) {
            var d = a.deriveFontSize(1 /
              B * c.weight, k.maxFontSize, k.minFontSize);
            d = b({fontSize: d + "px"}, k.style);
            n.css(d).attr({x: 0, y: 0, text: c.name});
            d = n.getBBox(!0);
            c.dimensions = {height: d.height, width: d.width}
          });
          var u = x(c.len, e.len, G);
          var H = D(a.spirals[k.spiral], {field: u});
          G.forEach(function (c) {
            var g = a.deriveFontSize(1 / B * c.weight, k.maxFontSize, k.minFontSize);
            g = b({fontSize: g + "px"}, k.style);
            var f = y(c, {data: G, field: u, placed: q, rotation: z}),
              e = b(a.pointAttribs(c, c.selected && "select"), {
                align: "center", "alignment-baseline": "middle", x: f.x, y: f.y, text: c.name,
                rotation: f.rotation
              }), n = K(f.x, f.y, c.dimensions.width, c.dimensions.height, f.rotation), m = J(n),
              v = A(c, {rectangle: m, polygon: n, field: u, placed: q, spiral: H, rotation: f.rotation});
            !v && t && (u = E(u, m), v = A(c, {
              rectangle: m,
              polygon: n,
              field: u,
              placed: q,
              spiral: H,
              rotation: f.rotation
            }));
            if (w(v)) {
              e.x += v.x;
              e.y += v.y;
              m.left += v.x;
              m.right += v.x;
              m.top += v.y;
              m.bottom += v.y;
              f = u;
              if (!h(f.left) || f.left > m.left) f.left = m.left;
              if (!h(f.right) || f.right < m.right) f.right = m.right;
              if (!h(f.top) || f.top > m.top) f.top = m.top;
              if (!h(f.bottom) || f.bottom < m.bottom) f.bottom =
                m.bottom;
              u = f;
              q.push(c);
              c.isNull = !1
            } else c.isNull = !0;
            if (r) {
              var x = {x: e.x, y: e.y};
              d ? (delete e.x, delete e.y) : (e.x = 0, e.y = 0)
            }
            c.draw({
              animatableAttribs: x,
              attribs: e,
              css: g,
              group: l,
              renderer: p,
              shapeArgs: void 0,
              shapeType: "text"
            })
          });
          n = n.destroy();
          c = C(c.len, e.len, u);
          a.group.attr({scaleX: c, scaleY: c})
        },
        hasData: function () {
          return w(this) && !0 === this.visible && c(this.points) && 0 < this.points.length
        },
        placementStrategy: {
          random: function (b, a) {
            var c = a.field;
            a = a.rotation;
            return {
              x: Math.round(c.width * (Math.random() + .5) / 2) - c.width /
                2,
              y: Math.round(c.height * (Math.random() + .5) / 2) - c.height / 2,
              rotation: t(a.orientations, b.index, a.from, a.to)
            }
          }, center: function (b, a) {
            a = a.rotation;
            return {x: 0, y: 0, rotation: t(a.orientations, b.index, a.from, a.to)}
          }
        },
        pointArrayMap: ["weight"],
        spirals: {
          archimedean: function (b, a) {
            var c = a.field;
            a = !1;
            c = c.width * c.width + c.height * c.height;
            var d = .8 * b;
            1E4 >= b && (a = {
              x: d * Math.cos(d),
              y: d * Math.sin(d)
            }, Math.min(Math.abs(a.x), Math.abs(a.y)) < c || (a = !1));
            return a
          }, rectangular: function (a, b) {
            a = r(a, b);
            b = b.field;
            a && (a.x *= b.ratioX, a.y *=
              b.ratioY);
            return a
          }, square: r
        },
        utils: {
          extendPlayingField: E,
          getRotation: t,
          isPolygonsColliding: F,
          rotate2DToOrigin: l.rotate2DToOrigin,
          rotate2DToPoint: l.rotate2DToPoint
        },
        getPlotBox: function () {
          var a = this.chart, b = a.inverted, c = this[b ? "yAxis" : "xAxis"];
          b = this[b ? "xAxis" : "yAxis"];
          return {
            translateX: (c ? c.left : a.plotLeft) + (c ? c.len : a.plotWidth) / 2,
            translateY: (b ? b.top : a.plotTop) + (b ? b.len : a.plotHeight) / 2,
            scaleX: 1,
            scaleY: 1
          }
        }
      }, {
        draw: k, shouldDraw: function () {
          return !this.isNull
        }, isValid: function () {
          return !0
        }, weight: 1
      })
    });
  k(a, "masters/modules/wordcloud.src.js", [], function () {
  })
});
//# sourceMappingURL=wordcloud.js.map
