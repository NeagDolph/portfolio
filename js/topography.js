var spawned = false;
var canhover = false;
var currentblob = document.body;
var currentblobi;
var preblob;
var scaleconst = 2000;
var noscroll = false;

function getxy(e) {
  var style = window.getComputedStyle(e);
  var matrix = new DOMMatrix(style.transform);
  return [matrix.m41, matrix.m42]
}

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

class Blob {
    constructor(el, options) {
        this.DOM = {};
        this.DOM.el = el;
        this.options = {};
        Object.assign(this.options, options);
        this.init();
    }
    init() {
        this.rect = this.DOM.el.getBoundingClientRect();
        this.layers = Array.from(this.DOM.el.querySelectorAll('path'), t => {
            

            if (this.options[0]) return t;
            t.style.transformOrigin = `${this.rect.left - getxy(this.DOM.el)[0] + this.rect.width/2}px ${this.rect.top - getxy(this.DOM.el)[1] + this.rect.height/2}px`;
            // t.style.transformOrigin = `50% 50%`;
            // t.style.opacity = 0;
            return t;
        });

        window.addEventListener('resize', debounce(() => {
            this.rect = this.DOM.el.getBoundingClientRect();
            this.layers.forEach(layer => layer.style.transformOrigin = `${this.rect.left - getxy(this.DOM.el)[0] + this.rect.width/2}px ${this.rect.top - getxy(this.DOM.el)[1] + this.rect.height/2}px`);
        }, 20));
    }
    intro(a, b, c, d) {
        anime.remove(this.layers);
        if (this.DOM.el.classList[0] == $(currentblob).attr("class")) {
            b = [0, 1.2]
            preblob = currentblob
        }
        anime({
            targets: this.layers,
            duration: a,
            delay: (t,i) => i*120,
            easing: [0.2,1,0.4,1],
            scale: b,
            opacity: {
                value: c,
                duration: d,
                delay: (t,i) => i*120,
                easing: 'linear',
            },
            complete: function() {
                canhover = true;
                if (preblob) {
                    if ($(currentblob).attr("class") !== preblob.classList[0]) {
                        blobyy = new Blob(preblob, [true]);
                        blobyy.delargen()
                    }
                    preblob = false
                }
            }
        });
    }
    outro(a, b, c, d) {
        anime.remove(this.layers);
        anime({
            targets: this.layers,
            duration: a,
            delay: (t,i) => i*120,
            easing: [0.2,1,0.4,1],
            scale: b,
            opacity: {
                value: c,
                duration: d,
                delay: (t,i) => i*120,
                easing: 'linear',
            }
        });
    }
    enlargen() {
        if (!canhover) return;
        anime.remove(this.layers);
        anime({
            targets: this.layers,
            duration: 900,
            delay: (t,i) => i*40,
            easing: [0.2,1,0.1,1],
            scale: 1.2,
        });
    }
    delargen() {
        if (!canhover) return;
        anime.remove(this.layers);
        anime({
            targets: this.layers.reverse(),
            duration: 900,
            delay: (t,i) => i*40,
            easing: [0.2,1,0.1,1],
            scale: 1,
        });
    }
    show() {
        setTimeout(() => this.intro(), 400);
    }
};

window.Blob = Blob;

const DOM = {};
let blobs = [];
DOM.svg = document.querySelector('svg.scene');
// setTimeout(() => document.body.classList.add('render'), 60);


$(".scene g").hover(function() {
    elem = $(this)
    currentblob = elem[0]
    currentblobi = $(".scene").index($(this))
    if (!spawned) return;
	blobyy = new Blob(elem[0], [true]);
	blobyy.enlargen()
},function() {
    currentblob = document.body
    // if (!spawned) return;
    ele = $(this)
	blobyy = new Blob(ele[0], [true]);
	blobyy.delargen()
})

$(window).scroll(() => {
    let scrolltop = $(window).scrollTop()
    sceneoffset = $(".topography").offset().top


    if (scrolltop > sceneoffset) {
        $(".topography").removeClass("blind")
        $(".scene").css("position", "fixed")
        if (spawned) return;
        spawned = true;
        Array.from(DOM.svg.querySelectorAll('g')).forEach((el) => {
            const blob = new Blob(el);
            blobs.push(blob);
            blob.intro(1200, [0.2, 1], [0,0.5], 600);
        });
        $(".topography").addClass('render')
    } else {
        if (!$(".topography").hasClass("blind")) $(".topography").addClass("blind")
        $(".scene").css("position", "relative")
        // noscroll = true;
        // if (!spawned) return;
        // spawned = false;
        // setTimeout(() => {
        //     $(".topography").removeClass('render')
        //     canhover = false;
        // }, 60);
        // setTimeout(() => {
        //     noscroll = false;
        // }, 300);
    }
});

$('body').on('scroll mousewheel touchmove', function(e) {
    if (noscroll) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
});