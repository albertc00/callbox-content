
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop$1() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop$1;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$1;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function getAllContexts() {
        return get_current_component().$$.context;
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop$1, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$1,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop$1;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }
    /**
     * Base class to create strongly typed Svelte components.
     * This only exists for typing purposes and should be used in `.d.ts` files.
     *
     * ### Example:
     *
     * You have component library on npm called `component-library`, from which
     * you export a component called `MyComponent`. For Svelte+TypeScript users,
     * you want to provide typings. Therefore you create a `index.d.ts`:
     * ```ts
     * import { SvelteComponentTyped } from "svelte";
     * export class MyComponent extends SvelteComponentTyped<{foo: string}> {}
     * ```
     * Typing this makes it possible for IDEs like VS Code with the Svelte extension
     * to provide intellisense and to use the component like this in a Svelte file
     * with TypeScript:
     * ```svelte
     * <script lang="ts">
     * 	import { MyComponent } from "component-library";
     * </script>
     * <MyComponent foo={'bar'} />
     * ```
     *
     * #### Why not make this part of `SvelteComponent(Dev)`?
     * Because
     * ```ts
     * class ASubclassOfSvelteComponent extends SvelteComponent<{foo: string}> {}
     * const component: typeof SvelteComponent = ASubclassOfSvelteComponent;
     * ```
     * will throw a type error, so we need to separate the more strictly typed class.
     */
    class SvelteComponentTyped extends SvelteComponentDev {
        constructor(options) {
            super(options);
        }
    }

    class Subscribable {
        constructor() {
            this.listeners = [];
        }
        subscribe(listener) {
            const callback = listener || (() => undefined);
            this.listeners.push(callback);
            this.onSubscribe();
            return () => {
                this.listeners = this.listeners.filter(x => x !== callback);
                this.onUnsubscribe();
            };
        }
        hasListeners() {
            return this.listeners.length > 0;
        }
        onSubscribe() {
            // Do nothing
        }
        onUnsubscribe() {
            // Do nothing
        }
    }

    // UTILS
    const isServer = typeof window === 'undefined';
    function noop() {
        return undefined;
    }
    function functionalUpdate(updater, input) {
        return typeof updater === 'function'
            ? updater(input)
            : updater;
    }
    function isValidTimeout(value) {
        return typeof value === 'number' && value >= 0 && value !== Infinity;
    }
    function ensureQueryKeyArray(value) {
        return (Array.isArray(value)
            ? value
            : [value]);
    }
    function timeUntilStale(updatedAt, staleTime) {
        return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
    }
    function parseQueryArgs(arg1, arg2, arg3) {
        if (!isQueryKey(arg1)) {
            return arg1;
        }
        if (typeof arg2 === 'function') {
            return Object.assign(Object.assign({}, arg3), { queryKey: arg1, queryFn: arg2 });
        }
        return Object.assign(Object.assign({}, arg2), { queryKey: arg1 });
    }
    function parseFilterArgs(arg1, arg2, arg3) {
        return (isQueryKey(arg1)
            ? [Object.assign(Object.assign({}, arg2), { queryKey: arg1 }), arg3]
            : [arg1 || {}, arg2]);
    }
    function mapQueryStatusFilter(active, inactive) {
        if ((active === true && inactive === true) ||
            (active == null && inactive == null)) {
            return 'all';
        }
        else if (active === false && inactive === false) {
            return 'none';
        }
        else {
            // At this point, active|inactive can only be true|false or false|true
            // so, when only one value is provided, the missing one has to be the negated value
            const isActive = active !== null && active !== void 0 ? active : !inactive;
            return isActive ? 'active' : 'inactive';
        }
    }
    function matchQuery(filters, query) {
        const { active, exact, fetching, inactive, predicate, queryKey, stale, } = filters;
        if (isQueryKey(queryKey)) {
            if (exact) {
                if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
                    return false;
                }
            }
            else if (!partialMatchKey(query.queryKey, queryKey)) {
                return false;
            }
        }
        const queryStatusFilter = mapQueryStatusFilter(active, inactive);
        if (queryStatusFilter === 'none') {
            return false;
        }
        else if (queryStatusFilter !== 'all') {
            const isActive = query.isActive();
            if (queryStatusFilter === 'active' && !isActive) {
                return false;
            }
            if (queryStatusFilter === 'inactive' && isActive) {
                return false;
            }
        }
        if (typeof stale === 'boolean' && query.isStale() !== stale) {
            return false;
        }
        if (typeof fetching === 'boolean' && query.isFetching() !== fetching) {
            return false;
        }
        if (predicate && !predicate(query)) {
            return false;
        }
        return true;
    }
    function matchMutation(filters, mutation) {
        const { exact, fetching, predicate, mutationKey } = filters;
        if (isQueryKey(mutationKey)) {
            if (!mutation.options.mutationKey) {
                return false;
            }
            if (exact) {
                if (hashQueryKey(mutation.options.mutationKey) !== hashQueryKey(mutationKey)) {
                    return false;
                }
            }
            else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
                return false;
            }
        }
        if (typeof fetching === 'boolean' &&
            (mutation.state.status === 'loading') !== fetching) {
            return false;
        }
        if (predicate && !predicate(mutation)) {
            return false;
        }
        return true;
    }
    function hashQueryKeyByOptions(queryKey, options) {
        const hashFn = (options === null || options === void 0 ? void 0 : options.queryKeyHashFn) || hashQueryKey;
        return hashFn(queryKey);
    }
    /**
     * Default query keys hash function.
     */
    function hashQueryKey(queryKey) {
        const asArray = ensureQueryKeyArray(queryKey);
        return stableValueHash(asArray);
    }
    /**
     * Hashes the value into a stable hash.
     */
    function stableValueHash(value) {
        return JSON.stringify(value, (_, val) => isPlainObject(val)
            ? Object.keys(val)
                .sort()
                .reduce((result, key) => {
                result[key] = val[key];
                return result;
            }, {})
            : val);
    }
    /**
     * Checks if key `b` partially matches with key `a`.
     */
    function partialMatchKey(a, b) {
        return partialDeepEqual(ensureQueryKeyArray(a), ensureQueryKeyArray(b));
    }
    /**
     * Checks if `b` partially matches with `a`.
     */
    function partialDeepEqual(a, b) {
        if (a === b) {
            return true;
        }
        if (typeof a !== typeof b) {
            return false;
        }
        if (a && b && typeof a === 'object' && typeof b === 'object') {
            return !Object.keys(b).some(key => !partialDeepEqual(a[key], b[key]));
        }
        return false;
    }
    function replaceEqualDeep(a, b) {
        if (a === b) {
            return a;
        }
        const array = Array.isArray(a) && Array.isArray(b);
        if (array || (isPlainObject(a) && isPlainObject(b))) {
            const aSize = array ? a.length : Object.keys(a).length;
            const bItems = array ? b : Object.keys(b);
            const bSize = bItems.length;
            const copy = array ? [] : {};
            let equalItems = 0;
            for (let i = 0; i < bSize; i++) {
                const key = array ? i : bItems[i];
                copy[key] = replaceEqualDeep(a[key], b[key]);
                if (copy[key] === a[key]) {
                    equalItems++;
                }
            }
            return aSize === bSize && equalItems === aSize ? a : copy;
        }
        return b;
    }
    /**
     * Shallow compare objects. Only works with objects that always have the same properties.
     */
    function shallowEqualObjects(a, b) {
        if ((a && !b) || (b && !a)) {
            return false;
        }
        for (const key in a) {
            if (a[key] !== b[key]) {
                return false;
            }
        }
        return true;
    }
    // Copied from: https://github.com/jonschlinkert/is-plain-object
    function isPlainObject(o) {
        if (!hasObjectPrototype(o)) {
            return false;
        }
        // If has modified constructor
        const ctor = o.constructor;
        if (typeof ctor === 'undefined') {
            return true;
        }
        // If has modified prototype
        const prot = ctor.prototype;
        if (!hasObjectPrototype(prot)) {
            return false;
        }
        // If constructor does not have an Object-specific method
        if (!prot.hasOwnProperty('isPrototypeOf')) {
            return false;
        }
        // Most likely a plain Object
        return true;
    }
    function hasObjectPrototype(o) {
        return Object.prototype.toString.call(o) === '[object Object]';
    }
    function isQueryKey(value) {
        return typeof value === 'string' || Array.isArray(value);
    }
    function sleep(timeout) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }
    /**
     * Schedules a microtask.
     * This can be useful to schedule state updates after rendering.
     */
    function scheduleMicrotask(callback) {
        Promise.resolve()
            .then(callback)
            .catch(error => setTimeout(() => {
            throw error;
        }));
    }
    function getAbortController() {
        if (typeof AbortController === 'function') {
            return new AbortController();
        }
    }

    class FocusManager extends Subscribable {
        constructor() {
            super();
            this.setup = onFocus => {
                if (!isServer && (window === null || window === void 0 ? void 0 : window.addEventListener)) {
                    const listener = () => onFocus();
                    // Listen to visibillitychange and focus
                    window.addEventListener('visibilitychange', listener, false);
                    window.addEventListener('focus', listener, false);
                    return () => {
                        // Be sure to unsubscribe if a new handler is set
                        window.removeEventListener('visibilitychange', listener);
                        window.removeEventListener('focus', listener);
                    };
                }
            };
        }
        onSubscribe() {
            if (!this.cleanup) {
                this.setEventListener(this.setup);
            }
        }
        onUnsubscribe() {
            var _a;
            if (!this.hasListeners()) {
                (_a = this.cleanup) === null || _a === void 0 ? void 0 : _a.call(this);
                this.cleanup = undefined;
            }
        }
        setEventListener(setup) {
            var _a;
            this.setup = setup;
            (_a = this.cleanup) === null || _a === void 0 ? void 0 : _a.call(this);
            this.cleanup = setup(focused => {
                if (typeof focused === 'boolean') {
                    this.setFocused(focused);
                }
                else {
                    this.onFocus();
                }
            });
        }
        setFocused(focused) {
            this.focused = focused;
            if (focused) {
                this.onFocus();
            }
        }
        onFocus() {
            this.listeners.forEach(listener => {
                listener();
            });
        }
        isFocused() {
            if (typeof this.focused === 'boolean') {
                return this.focused;
            }
            // document global can be unavailable in react native
            if (typeof document === 'undefined') {
                return true;
            }
            return [undefined, 'visible', 'prerender'].includes(document.visibilityState);
        }
    }
    const focusManager = new FocusManager();

    class OnlineManager extends Subscribable {
        constructor() {
            super();
            this.setup = onOnline => {
                if (!isServer && (window === null || window === void 0 ? void 0 : window.addEventListener)) {
                    const listener = () => onOnline();
                    // Listen to online
                    window.addEventListener('online', listener, false);
                    window.addEventListener('offline', listener, false);
                    return () => {
                        // Be sure to unsubscribe if a new handler is set
                        window.removeEventListener('online', listener);
                        window.removeEventListener('offline', listener);
                    };
                }
            };
        }
        onSubscribe() {
            if (!this.cleanup) {
                this.setEventListener(this.setup);
            }
        }
        onUnsubscribe() {
            var _a;
            if (!this.hasListeners()) {
                (_a = this.cleanup) === null || _a === void 0 ? void 0 : _a.call(this);
                this.cleanup = undefined;
            }
        }
        setEventListener(setup) {
            var _a;
            this.setup = setup;
            (_a = this.cleanup) === null || _a === void 0 ? void 0 : _a.call(this);
            this.cleanup = setup((online) => {
                if (typeof online === 'boolean') {
                    this.setOnline(online);
                }
                else {
                    this.onOnline();
                }
            });
        }
        setOnline(online) {
            this.online = online;
            if (online) {
                this.onOnline();
            }
        }
        onOnline() {
            this.listeners.forEach(listener => {
                listener();
            });
        }
        isOnline() {
            if (typeof this.online === 'boolean') {
                return this.online;
            }
            if (typeof navigator === 'undefined' ||
                typeof navigator.onLine === 'undefined') {
                return true;
            }
            return navigator.onLine;
        }
    }
    const onlineManager = new OnlineManager();

    function defaultRetryDelay(failureCount) {
        return Math.min(1000 * 2 ** failureCount, 30000);
    }
    function isCancelable(value) {
        return typeof (value === null || value === void 0 ? void 0 : value.cancel) === 'function';
    }
    class CancelledError {
        constructor(options) {
            this.revert = options === null || options === void 0 ? void 0 : options.revert;
            this.silent = options === null || options === void 0 ? void 0 : options.silent;
        }
    }
    function isCancelledError(value) {
        return value instanceof CancelledError;
    }
    // CLASS
    class Retryer {
        constructor(config) {
            let cancelRetry = false;
            let cancelFn;
            let continueFn;
            let promiseResolve;
            let promiseReject;
            this.abort = config.abort;
            this.cancel = cancelOptions => cancelFn === null || cancelFn === void 0 ? void 0 : cancelFn(cancelOptions);
            this.cancelRetry = () => {
                cancelRetry = true;
            };
            this.continueRetry = () => {
                cancelRetry = false;
            };
            this.continue = () => continueFn === null || continueFn === void 0 ? void 0 : continueFn();
            this.failureCount = 0;
            this.isPaused = false;
            this.isResolved = false;
            this.isTransportCancelable = false;
            this.promise = new Promise((outerResolve, outerReject) => {
                promiseResolve = outerResolve;
                promiseReject = outerReject;
            });
            const resolve = (value) => {
                var _a;
                if (!this.isResolved) {
                    this.isResolved = true;
                    (_a = config.onSuccess) === null || _a === void 0 ? void 0 : _a.call(config, value);
                    continueFn === null || continueFn === void 0 ? void 0 : continueFn();
                    promiseResolve(value);
                }
            };
            const reject = (value) => {
                var _a;
                if (!this.isResolved) {
                    this.isResolved = true;
                    (_a = config.onError) === null || _a === void 0 ? void 0 : _a.call(config, value);
                    continueFn === null || continueFn === void 0 ? void 0 : continueFn();
                    promiseReject(value);
                }
            };
            const pause = () => {
                return new Promise(continueResolve => {
                    var _a;
                    continueFn = continueResolve;
                    this.isPaused = true;
                    (_a = config.onPause) === null || _a === void 0 ? void 0 : _a.call(config);
                }).then(() => {
                    var _a;
                    continueFn = undefined;
                    this.isPaused = false;
                    (_a = config.onContinue) === null || _a === void 0 ? void 0 : _a.call(config);
                });
            };
            // Create loop function
            const run = () => {
                // Do nothing if already resolved
                if (this.isResolved) {
                    return;
                }
                let promiseOrValue;
                // Execute query
                try {
                    promiseOrValue = config.fn();
                }
                catch (error) {
                    promiseOrValue = Promise.reject(error);
                }
                // Create callback to cancel this fetch
                cancelFn = cancelOptions => {
                    var _a;
                    if (!this.isResolved) {
                        reject(new CancelledError(cancelOptions));
                        (_a = this.abort) === null || _a === void 0 ? void 0 : _a.call(this);
                        // Cancel transport if supported
                        if (isCancelable(promiseOrValue)) {
                            try {
                                promiseOrValue.cancel();
                            }
                            catch (_b) { }
                        }
                    }
                };
                // Check if the transport layer support cancellation
                this.isTransportCancelable = isCancelable(promiseOrValue);
                Promise.resolve(promiseOrValue)
                    .then(resolve)
                    .catch(error => {
                    var _a, _b, _c;
                    // Stop if the fetch is already resolved
                    if (this.isResolved) {
                        return;
                    }
                    // Do we need to retry the request?
                    const retry = (_a = config.retry) !== null && _a !== void 0 ? _a : 3;
                    const retryDelay = (_b = config.retryDelay) !== null && _b !== void 0 ? _b : defaultRetryDelay;
                    const delay = typeof retryDelay === 'function'
                        ? retryDelay(this.failureCount, error)
                        : retryDelay;
                    const shouldRetry = retry === true ||
                        (typeof retry === 'number' && this.failureCount < retry) ||
                        (typeof retry === 'function' && retry(this.failureCount, error));
                    if (cancelRetry || !shouldRetry) {
                        // We are done if the query does not need to be retried
                        reject(error);
                        return;
                    }
                    this.failureCount++;
                    // Notify on fail
                    (_c = config.onFail) === null || _c === void 0 ? void 0 : _c.call(config, this.failureCount, error);
                    // Delay
                    sleep(delay)
                        // Pause if the document is not visible or when the device is offline
                        .then(() => {
                        if (!focusManager.isFocused() || !onlineManager.isOnline()) {
                            return pause();
                        }
                    })
                        .then(() => {
                        if (cancelRetry) {
                            reject(error);
                        }
                        else {
                            run();
                        }
                    });
                });
            };
            // Start loop
            run();
        }
    }

    // CLASS
    class NotifyManager {
        constructor() {
            this.queue = [];
            this.transactions = 0;
            this.notifyFn = (callback) => {
                callback();
            };
            this.batchNotifyFn = (callback) => {
                callback();
            };
        }
        batch(callback) {
            let result;
            this.transactions++;
            try {
                result = callback();
            }
            finally {
                this.transactions--;
                if (!this.transactions) {
                    this.flush();
                }
            }
            return result;
        }
        schedule(callback) {
            if (this.transactions) {
                this.queue.push(callback);
            }
            else {
                scheduleMicrotask(() => {
                    this.notifyFn(callback);
                });
            }
        }
        /**
         * All calls to the wrapped function will be batched.
         */
        batchCalls(callback) {
            return ((...args) => {
                this.schedule(() => {
                    callback(...args);
                });
            });
        }
        flush() {
            const queue = this.queue;
            this.queue = [];
            if (queue.length) {
                scheduleMicrotask(() => {
                    this.batchNotifyFn(() => {
                        queue.forEach(callback => {
                            this.notifyFn(callback);
                        });
                    });
                });
            }
        }
        /**
         * Use this method to set a custom notify function.
         * This can be used to for example wrap notifications with `React.act` while running tests.
         */
        setNotifyFunction(fn) {
            this.notifyFn = fn;
        }
        /**
         * Use this method to set a custom function to batch notifications together into a single tick.
         * By default React Query will use the batch function provided by ReactDOM or React Native.
         */
        setBatchNotifyFunction(fn) {
            this.batchNotifyFn = fn;
        }
    }
    // SINGLETON
    const notifyManager = new NotifyManager();

    // TYPES
    // FUNCTIONS
    let logger = console;
    function getLogger() {
        return logger;
    }

    // CLASS
    class Query$2 {
        constructor(config) {
            this.abortSignalConsumed = false;
            this.hadObservers = false;
            this.defaultOptions = config.defaultOptions;
            this.setOptions(config.options);
            this.observers = [];
            this.cache = config.cache;
            this.queryKey = config.queryKey;
            this.queryHash = config.queryHash;
            this.initialState = config.state || this.getDefaultState(this.options);
            this.state = this.initialState;
            this.meta = config.meta;
            this.scheduleGc();
        }
        setOptions(options) {
            var _a;
            this.options = Object.assign(Object.assign({}, this.defaultOptions), options);
            this.meta = options === null || options === void 0 ? void 0 : options.meta;
            // Default to 5 minutes if not cache time is set
            this.cacheTime = Math.max(this.cacheTime || 0, (_a = this.options.cacheTime) !== null && _a !== void 0 ? _a : 5 * 60 * 1000);
        }
        setDefaultOptions(options) {
            this.defaultOptions = options;
        }
        scheduleGc() {
            this.clearGcTimeout();
            if (isValidTimeout(this.cacheTime)) {
                // @ts-ignore
                this.gcTimeout = setTimeout(() => {
                    this.optionalRemove();
                }, this.cacheTime);
            }
        }
        clearGcTimeout() {
            clearTimeout(this.gcTimeout);
            this.gcTimeout = undefined;
        }
        optionalRemove() {
            if (!this.observers.length) {
                if (this.state.isFetching) {
                    if (this.hadObservers) {
                        this.scheduleGc();
                    }
                }
                else {
                    this.cache.remove(this);
                }
            }
        }
        setData(updater, options) {
            var _a, _b;
            const prevData = this.state.data;
            // Get the new data
            let data = functionalUpdate(updater, prevData);
            // Use prev data if an isDataEqual function is defined and returns `true`
            if ((_b = (_a = this.options).isDataEqual) === null || _b === void 0 ? void 0 : _b.call(_a, prevData, data)) {
                data = prevData;
            }
            else if (this.options.structuralSharing !== false) {
                // Structurally share data between prev and new data if needed
                data = replaceEqualDeep(prevData, data);
            }
            // Set data and mark it as cached
            this.dispatch({
                data,
                type: 'success',
                dataUpdatedAt: options === null || options === void 0 ? void 0 : options.updatedAt,
            });
            return data;
        }
        setState(state, setStateOptions) {
            this.dispatch({ type: 'setState', state, setStateOptions });
        }
        cancel(options) {
            var _a;
            const promise = this.promise;
            (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.cancel(options);
            return promise ? promise.then(noop).catch(noop) : Promise.resolve();
        }
        destroy() {
            this.clearGcTimeout();
            this.cancel({ silent: true });
        }
        reset() {
            this.destroy();
            this.setState(this.initialState);
        }
        isActive() {
            return this.observers.some(observer => observer.options.enabled !== false);
        }
        isFetching() {
            return this.state.isFetching;
        }
        isStale() {
            return (this.state.isInvalidated ||
                !this.state.dataUpdatedAt ||
                this.observers.some(observer => observer.getCurrentResult().isStale));
        }
        isStaleByTime(staleTime = 0) {
            return (this.state.isInvalidated ||
                !this.state.dataUpdatedAt ||
                !timeUntilStale(this.state.dataUpdatedAt, staleTime));
        }
        onFocus() {
            var _a;
            const observer = this.observers.find(x => x.shouldFetchOnWindowFocus());
            if (observer) {
                observer.refetch();
            }
            // Continue fetch if currently paused
            (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.continue();
        }
        onOnline() {
            var _a;
            const observer = this.observers.find(x => x.shouldFetchOnReconnect());
            if (observer) {
                observer.refetch();
            }
            // Continue fetch if currently paused
            (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.continue();
        }
        addObserver(observer) {
            if (this.observers.indexOf(observer) === -1) {
                this.observers.push(observer);
                this.hadObservers = true;
                // Stop the query from being garbage collected
                this.clearGcTimeout();
                this.cache.notify({ type: 'observerAdded', query: this, observer });
            }
        }
        removeObserver(observer) {
            if (this.observers.indexOf(observer) !== -1) {
                this.observers = this.observers.filter(x => x !== observer);
                if (!this.observers.length) {
                    // If the transport layer does not support cancellation
                    // we'll let the query continue so the result can be cached
                    if (this.retryer) {
                        if (this.retryer.isTransportCancelable || this.abortSignalConsumed) {
                            this.retryer.cancel({ revert: true });
                        }
                        else {
                            this.retryer.cancelRetry();
                        }
                    }
                    if (this.cacheTime) {
                        this.scheduleGc();
                    }
                    else {
                        this.cache.remove(this);
                    }
                }
                this.cache.notify({ type: 'observerRemoved', query: this, observer });
            }
        }
        getObserversCount() {
            return this.observers.length;
        }
        invalidate() {
            if (!this.state.isInvalidated) {
                this.dispatch({ type: 'invalidate' });
            }
        }
        fetch(options, fetchOptions) {
            var _a, _b, _c, _d, _e, _f;
            if (this.state.isFetching) {
                if (this.state.dataUpdatedAt && (fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.cancelRefetch)) {
                    // Silently cancel current fetch if the user wants to cancel refetches
                    this.cancel({ silent: true });
                }
                else if (this.promise) {
                    // make sure that retries that were potentially cancelled due to unmounts can continue
                    (_a = this.retryer) === null || _a === void 0 ? void 0 : _a.continueRetry();
                    // Return current promise if we are already fetching
                    return this.promise;
                }
            }
            // Update config if passed, otherwise the config from the last execution is used
            if (options) {
                this.setOptions(options);
            }
            // Use the options from the first observer with a query function if no function is found.
            // This can happen when the query is hydrated or created with setQueryData.
            if (!this.options.queryFn) {
                const observer = this.observers.find(x => x.options.queryFn);
                if (observer) {
                    this.setOptions(observer.options);
                }
            }
            const queryKey = ensureQueryKeyArray(this.queryKey);
            const abortController = getAbortController();
            // Create query function context
            const queryFnContext = {
                queryKey,
                pageParam: undefined,
                meta: this.meta,
            };
            Object.defineProperty(queryFnContext, 'signal', {
                enumerable: true,
                get: () => {
                    if (abortController) {
                        this.abortSignalConsumed = true;
                        return abortController.signal;
                    }
                    return undefined;
                },
            });
            // Create fetch function
            const fetchFn = () => {
                if (!this.options.queryFn) {
                    return Promise.reject('Missing queryFn');
                }
                this.abortSignalConsumed = false;
                return this.options.queryFn(queryFnContext);
            };
            // Trigger behavior hook
            const context = {
                fetchOptions,
                options: this.options,
                queryKey: queryKey,
                state: this.state,
                fetchFn,
                meta: this.meta,
            };
            if ((_b = this.options.behavior) === null || _b === void 0 ? void 0 : _b.onFetch) {
                (_c = this.options.behavior) === null || _c === void 0 ? void 0 : _c.onFetch(context);
            }
            // Store state in case the current fetch needs to be reverted
            this.revertState = this.state;
            // Set to fetching state if not already in it
            if (!this.state.isFetching ||
                this.state.fetchMeta !== ((_d = context.fetchOptions) === null || _d === void 0 ? void 0 : _d.meta)) {
                this.dispatch({ type: 'fetch', meta: (_e = context.fetchOptions) === null || _e === void 0 ? void 0 : _e.meta });
            }
            // Try to fetch the data
            this.retryer = new Retryer({
                fn: context.fetchFn,
                abort: (_f = abortController === null || abortController === void 0 ? void 0 : abortController.abort) === null || _f === void 0 ? void 0 : _f.bind(abortController),
                onSuccess: data => {
                    var _a, _b;
                    this.setData(data);
                    // Notify cache callback
                    (_b = (_a = this.cache.config).onSuccess) === null || _b === void 0 ? void 0 : _b.call(_a, data, this);
                    // Remove query after fetching if cache time is 0
                    if (this.cacheTime === 0) {
                        this.optionalRemove();
                    }
                },
                onError: (error) => {
                    var _a, _b;
                    // Optimistically update state if needed
                    if (!(isCancelledError(error) && error.silent)) {
                        this.dispatch({
                            type: 'error',
                            error: error,
                        });
                    }
                    if (!isCancelledError(error)) {
                        // Notify cache callback
                        (_b = (_a = this.cache.config).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, this);
                        // Log error
                        getLogger().error(error);
                    }
                    // Remove query after fetching if cache time is 0
                    if (this.cacheTime === 0) {
                        this.optionalRemove();
                    }
                },
                onFail: () => {
                    this.dispatch({ type: 'failed' });
                },
                onPause: () => {
                    this.dispatch({ type: 'pause' });
                },
                onContinue: () => {
                    this.dispatch({ type: 'continue' });
                },
                retry: context.options.retry,
                retryDelay: context.options.retryDelay,
            });
            this.promise = this.retryer.promise;
            return this.promise;
        }
        dispatch(action) {
            this.state = this.reducer(this.state, action);
            notifyManager.batch(() => {
                this.observers.forEach(observer => {
                    observer.onQueryUpdate(action);
                });
                this.cache.notify({ query: this, type: 'queryUpdated', action });
            });
        }
        getDefaultState(options) {
            const data = typeof options.initialData === 'function'
                ? options.initialData()
                : options.initialData;
            const hasInitialData = typeof options.initialData !== 'undefined';
            const initialDataUpdatedAt = hasInitialData
                ? typeof options.initialDataUpdatedAt === 'function'
                    ? options.initialDataUpdatedAt()
                    : options.initialDataUpdatedAt
                : 0;
            const hasData = typeof data !== 'undefined';
            return {
                data,
                dataUpdateCount: 0,
                dataUpdatedAt: hasData ? initialDataUpdatedAt !== null && initialDataUpdatedAt !== void 0 ? initialDataUpdatedAt : Date.now() : 0,
                error: null,
                errorUpdateCount: 0,
                errorUpdatedAt: 0,
                fetchFailureCount: 0,
                fetchMeta: null,
                isFetching: false,
                isInvalidated: false,
                isPaused: false,
                status: hasData ? 'success' : 'idle',
            };
        }
        reducer(state, action) {
            var _a, _b;
            switch (action.type) {
                case 'failed':
                    return Object.assign(Object.assign({}, state), { fetchFailureCount: state.fetchFailureCount + 1 });
                case 'pause':
                    return Object.assign(Object.assign({}, state), { isPaused: true });
                case 'continue':
                    return Object.assign(Object.assign({}, state), { isPaused: false });
                case 'fetch':
                    return Object.assign(Object.assign(Object.assign({}, state), { fetchFailureCount: 0, fetchMeta: (_a = action.meta) !== null && _a !== void 0 ? _a : null, isFetching: true, isPaused: false }), (!state.dataUpdatedAt && {
                        error: null,
                        status: 'loading',
                    }));
                case 'success':
                    return Object.assign(Object.assign({}, state), { data: action.data, dataUpdateCount: state.dataUpdateCount + 1, dataUpdatedAt: (_b = action.dataUpdatedAt) !== null && _b !== void 0 ? _b : Date.now(), error: null, fetchFailureCount: 0, isFetching: false, isInvalidated: false, isPaused: false, status: 'success' });
                case 'error':
                    const error = action.error;
                    if (isCancelledError(error) && error.revert && this.revertState) {
                        return Object.assign({}, this.revertState);
                    }
                    return Object.assign(Object.assign({}, state), { error: error, errorUpdateCount: state.errorUpdateCount + 1, errorUpdatedAt: Date.now(), fetchFailureCount: state.fetchFailureCount + 1, isFetching: false, isPaused: false, status: 'error' });
                case 'invalidate':
                    return Object.assign(Object.assign({}, state), { isInvalidated: true });
                case 'setState':
                    return Object.assign(Object.assign({}, state), action.state);
                default:
                    return state;
            }
        }
    }

    class QueryObserver extends Subscribable {
        constructor(client, options) {
            super();
            this.client = client;
            this.options = options;
            this.trackedProps = [];
            this.previousSelectError = null;
            this.bindMethods();
            this.setOptions(options);
        }
        bindMethods() {
            this.remove = this.remove.bind(this);
            this.refetch = this.refetch.bind(this);
        }
        onSubscribe() {
            if (this.listeners.length === 1) {
                this.currentQuery.addObserver(this);
                if (shouldFetchOnMount(this.currentQuery, this.options)) {
                    this.executeFetch();
                }
                this.updateTimers();
            }
        }
        onUnsubscribe() {
            if (!this.listeners.length) {
                this.destroy();
            }
        }
        shouldFetchOnReconnect() {
            return shouldFetchOnReconnect(this.currentQuery, this.options);
        }
        shouldFetchOnWindowFocus() {
            return shouldFetchOnWindowFocus(this.currentQuery, this.options);
        }
        destroy() {
            this.listeners = [];
            this.clearTimers();
            this.currentQuery.removeObserver(this);
        }
        setOptions(options, notifyOptions) {
            const prevOptions = this.options;
            const prevQuery = this.currentQuery;
            this.options = this.client.defaultQueryObserverOptions(options);
            if (typeof this.options.enabled !== 'undefined' &&
                typeof this.options.enabled !== 'boolean') {
                throw new Error('Expected enabled to be a boolean');
            }
            // Keep previous query key if the user does not supply one
            if (!this.options.queryKey) {
                this.options.queryKey = prevOptions.queryKey;
            }
            this.updateQuery();
            const mounted = this.hasListeners();
            // Fetch if there are subscribers
            if (mounted &&
                shouldFetchOptionally(this.currentQuery, prevQuery, this.options, prevOptions)) {
                this.executeFetch();
            }
            // Update result
            this.updateResult(notifyOptions);
            // Update stale interval if needed
            if (mounted &&
                (this.currentQuery !== prevQuery ||
                    this.options.enabled !== prevOptions.enabled ||
                    this.options.staleTime !== prevOptions.staleTime)) {
                this.updateStaleTimeout();
            }
            const nextRefetchInterval = this.computeRefetchInterval();
            // Update refetch interval if needed
            if (mounted &&
                (this.currentQuery !== prevQuery ||
                    this.options.enabled !== prevOptions.enabled ||
                    nextRefetchInterval !== this.currentRefetchInterval)) {
                this.updateRefetchInterval(nextRefetchInterval);
            }
        }
        updateOptions(options, notifyOptions) {
            const mergedOptions = Object.assign(Object.assign({}, this.options), options);
            if (options.queryKey && !options.queryHash && options.queryKey !== this.options.queryKey) {
                mergedOptions.queryHash = hashQueryKeyByOptions(options.queryKey, mergedOptions);
            }
            this.setOptions(mergedOptions, notifyOptions);
        }
        getOptimisticResult(options) {
            const defaultedOptions = this.client.defaultQueryObserverOptions(options);
            const query = this.client
                .getQueryCache()
                .build(this.client, defaultedOptions);
            return this.createResult(query, defaultedOptions);
        }
        getCurrentResult() {
            return this.currentResult;
        }
        trackResult(result, defaultedOptions) {
            const trackedResult = {};
            const trackProp = (key) => {
                if (!this.trackedProps.includes(key)) {
                    this.trackedProps.push(key);
                }
            };
            Object.keys(result).forEach(key => {
                Object.defineProperty(trackedResult, key, {
                    configurable: false,
                    enumerable: true,
                    get: () => {
                        trackProp(key);
                        return result[key];
                    },
                });
            });
            if (defaultedOptions.useErrorBoundary || defaultedOptions.suspense) {
                trackProp('error');
            }
            return trackedResult;
        }
        getNextResult(options) {
            return new Promise((resolve, reject) => {
                const unsubscribe = this.subscribe(result => {
                    if (!result.isFetching) {
                        unsubscribe();
                        if (result.isError && (options === null || options === void 0 ? void 0 : options.throwOnError)) {
                            reject(result.error);
                        }
                        else {
                            resolve(result);
                        }
                    }
                });
            });
        }
        getCurrentQuery() {
            return this.currentQuery;
        }
        remove() {
            this.client.getQueryCache().remove(this.currentQuery);
        }
        refetch(options) {
            return this.fetch(Object.assign(Object.assign({}, options), { meta: { refetchPage: options === null || options === void 0 ? void 0 : options.refetchPage } }));
        }
        fetchOptimistic(options) {
            const defaultedOptions = this.client.defaultQueryObserverOptions(options);
            const query = this.client
                .getQueryCache()
                .build(this.client, defaultedOptions);
            return query.fetch().then(() => this.createResult(query, defaultedOptions));
        }
        fetch(fetchOptions) {
            return this.executeFetch(fetchOptions).then(() => {
                this.updateResult();
                return this.currentResult;
            });
        }
        executeFetch(fetchOptions) {
            // Make sure we reference the latest query as the current one might have been removed
            this.updateQuery();
            // Fetch
            let promise = this.currentQuery.fetch(this.options, fetchOptions);
            if (!(fetchOptions === null || fetchOptions === void 0 ? void 0 : fetchOptions.throwOnError)) {
                promise = promise.catch(noop);
            }
            return promise;
        }
        updateStaleTimeout() {
            this.clearStaleTimeout();
            if (isServer ||
                this.currentResult.isStale ||
                !isValidTimeout(this.options.staleTime)) {
                return;
            }
            const time = timeUntilStale(this.currentResult.dataUpdatedAt, this.options.staleTime);
            // The timeout is sometimes triggered 1 ms before the stale time expiration.
            // To mitigate this issue we always add 1 ms to the timeout.
            const timeout = time + 1;
            // @ts-ignore
            this.staleTimeoutId = setTimeout(() => {
                if (!this.currentResult.isStale) {
                    this.updateResult();
                }
            }, timeout);
        }
        computeRefetchInterval() {
            var _a;
            return typeof this.options.refetchInterval === 'function'
                ? this.options.refetchInterval(this.currentResult.data, this.currentQuery)
                : (_a = this.options.refetchInterval) !== null && _a !== void 0 ? _a : false;
        }
        updateRefetchInterval(nextInterval) {
            this.clearRefetchInterval();
            this.currentRefetchInterval = nextInterval;
            if (isServer ||
                this.options.enabled === false ||
                !isValidTimeout(this.currentRefetchInterval) ||
                this.currentRefetchInterval === 0) {
                return;
            }
            // @ts-ignore
            this.refetchIntervalId = setInterval(() => {
                if (this.options.refetchIntervalInBackground ||
                    focusManager.isFocused()) {
                    this.executeFetch();
                }
            }, this.currentRefetchInterval);
        }
        updateTimers() {
            this.updateStaleTimeout();
            this.updateRefetchInterval(this.computeRefetchInterval());
        }
        clearTimers() {
            this.clearStaleTimeout();
            this.clearRefetchInterval();
        }
        clearStaleTimeout() {
            clearTimeout(this.staleTimeoutId);
            this.staleTimeoutId = undefined;
        }
        clearRefetchInterval() {
            clearInterval(this.refetchIntervalId);
            this.refetchIntervalId = undefined;
        }
        createResult(query, options) {
            var _a;
            const prevQuery = this.currentQuery;
            const prevOptions = this.options;
            const prevResult = this.currentResult;
            const prevResultState = this.currentResultState;
            const prevResultOptions = this.currentResultOptions;
            const queryChange = query !== prevQuery;
            const queryInitialState = queryChange
                ? query.state
                : this.currentQueryInitialState;
            const prevQueryResult = queryChange
                ? this.currentResult
                : this.previousQueryResult;
            const { state } = query;
            let { dataUpdatedAt, error, errorUpdatedAt, isFetching, status } = state;
            let isPreviousData = false;
            let isPlaceholderData = false;
            let data;
            // Optimistically set result in fetching state if needed
            // @ts-ignore
            if (options.optimisticResults) {
                const mounted = this.hasListeners();
                const fetchOnMount = !mounted && shouldFetchOnMount(query, options);
                const fetchOptionally = mounted && shouldFetchOptionally(query, prevQuery, options, prevOptions);
                if (fetchOnMount || fetchOptionally) {
                    isFetching = true;
                    if (!dataUpdatedAt) {
                        status = 'loading';
                    }
                }
            }
            // Keep previous data if needed
            if (options.keepPreviousData &&
                !state.dataUpdateCount && (prevQueryResult === null || prevQueryResult === void 0 ? void 0 : prevQueryResult.isSuccess) &&
                status !== 'error') {
                data = prevQueryResult.data;
                dataUpdatedAt = prevQueryResult.dataUpdatedAt;
                status = prevQueryResult.status;
                isPreviousData = true;
            }
            // Select data if needed
            else if (options.select && typeof state.data !== 'undefined') {
                // Memoize select result
                if (prevResult &&
                    state.data === (prevResultState === null || prevResultState === void 0 ? void 0 : prevResultState.data) &&
                    options.select === ((_a = this.previousSelect) === null || _a === void 0 ? void 0 : _a.fn) &&
                    !this.previousSelectError) {
                    data = this.previousSelect.result;
                }
                else {
                    try {
                        data = options.select(state.data);
                        if (options.structuralSharing !== false) {
                            data = replaceEqualDeep(prevResult === null || prevResult === void 0 ? void 0 : prevResult.data, data);
                        }
                        this.previousSelect = {
                            fn: options.select,
                            result: data,
                        };
                        this.previousSelectError = null;
                    }
                    catch (selectError) {
                        getLogger().error(selectError);
                        error = selectError;
                        this.previousSelectError = selectError;
                        errorUpdatedAt = Date.now();
                        status = 'error';
                    }
                }
            }
            // Use query data
            else {
                data = state.data;
            }
            // Show placeholder data if needed
            if (typeof options.placeholderData !== 'undefined' &&
                typeof data === 'undefined' &&
                (status === 'loading' || status === 'idle')) {
                let placeholderData;
                // Memoize placeholder data
                if ((prevResult === null || prevResult === void 0 ? void 0 : prevResult.isPlaceholderData) &&
                    options.placeholderData === (prevResultOptions === null || prevResultOptions === void 0 ? void 0 : prevResultOptions.placeholderData)) {
                    placeholderData = prevResult.data;
                }
                else {
                    placeholderData =
                        typeof options.placeholderData === 'function'
                            ? options.placeholderData()
                            : options.placeholderData;
                    if (options.select && typeof placeholderData !== 'undefined') {
                        try {
                            placeholderData = options.select(placeholderData);
                            if (options.structuralSharing !== false) {
                                placeholderData = replaceEqualDeep(prevResult === null || prevResult === void 0 ? void 0 : prevResult.data, placeholderData);
                            }
                            this.previousSelectError = null;
                        }
                        catch (selectError) {
                            getLogger().error(selectError);
                            error = selectError;
                            this.previousSelectError = selectError;
                            errorUpdatedAt = Date.now();
                            status = 'error';
                        }
                    }
                }
                if (typeof placeholderData !== 'undefined') {
                    status = 'success';
                    data = placeholderData;
                    isPlaceholderData = true;
                }
            }
            const result = {
                status,
                isLoading: status === 'loading',
                isSuccess: status === 'success',
                isError: status === 'error',
                isIdle: status === 'idle',
                data,
                dataUpdatedAt,
                error,
                errorUpdatedAt,
                failureCount: state.fetchFailureCount,
                isFetched: state.dataUpdateCount > 0 || state.errorUpdateCount > 0,
                isFetchedAfterMount: state.dataUpdateCount > queryInitialState.dataUpdateCount ||
                    state.errorUpdateCount > queryInitialState.errorUpdateCount,
                isFetching,
                isRefetching: isFetching && status !== 'loading',
                isLoadingError: status === 'error' && state.dataUpdatedAt === 0,
                isPlaceholderData,
                isPreviousData,
                isRefetchError: status === 'error' && state.dataUpdatedAt !== 0,
                isStale: isStale(query, options),
                refetch: this.refetch,
                remove: this.remove,
            };
            return result;
        }
        shouldNotifyListeners(result, prevResult) {
            if (!prevResult) {
                return true;
            }
            const { notifyOnChangeProps, notifyOnChangePropsExclusions } = this.options;
            if (!notifyOnChangeProps && !notifyOnChangePropsExclusions) {
                return true;
            }
            if (notifyOnChangeProps === 'tracked' && !this.trackedProps.length) {
                return true;
            }
            const includedProps = notifyOnChangeProps === 'tracked'
                ? this.trackedProps
                : notifyOnChangeProps;
            return Object.keys(result).some(key => {
                const typedKey = key;
                const changed = result[typedKey] !== prevResult[typedKey];
                const isIncluded = includedProps === null || includedProps === void 0 ? void 0 : includedProps.some(x => x === key);
                const isExcluded = notifyOnChangePropsExclusions === null || notifyOnChangePropsExclusions === void 0 ? void 0 : notifyOnChangePropsExclusions.some(x => x === key);
                return changed && !isExcluded && (!includedProps || isIncluded);
            });
        }
        updateResult(notifyOptions) {
            const prevResult = this.currentResult;
            this.currentResult = this.createResult(this.currentQuery, this.options);
            this.currentResultState = this.currentQuery.state;
            this.currentResultOptions = this.options;
            // Only notify if something has changed
            if (shallowEqualObjects(this.currentResult, prevResult)) {
                return;
            }
            // Determine which callbacks to trigger
            const defaultNotifyOptions = { cache: true };
            if ((notifyOptions === null || notifyOptions === void 0 ? void 0 : notifyOptions.listeners) !== false &&
                this.shouldNotifyListeners(this.currentResult, prevResult)) {
                defaultNotifyOptions.listeners = true;
            }
            this.notify(Object.assign(Object.assign({}, defaultNotifyOptions), notifyOptions));
        }
        updateQuery() {
            const query = this.client
                .getQueryCache()
                .build(this.client, this.options);
            if (query === this.currentQuery) {
                return;
            }
            const prevQuery = this.currentQuery;
            this.currentQuery = query;
            this.currentQueryInitialState = query.state;
            this.previousQueryResult = this.currentResult;
            if (this.hasListeners()) {
                prevQuery === null || prevQuery === void 0 ? void 0 : prevQuery.removeObserver(this);
                query.addObserver(this);
            }
        }
        onQueryUpdate(action) {
            const notifyOptions = {};
            if (action.type === 'success') {
                notifyOptions.onSuccess = true;
            }
            else if (action.type === 'error' && !isCancelledError(action.error)) {
                notifyOptions.onError = true;
            }
            this.updateResult(notifyOptions);
            if (this.hasListeners()) {
                this.updateTimers();
            }
        }
        notify(notifyOptions) {
            notifyManager.batch(() => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                // First trigger the configuration callbacks
                if (notifyOptions.onSuccess) {
                    (_b = (_a = this.options).onSuccess) === null || _b === void 0 ? void 0 : _b.call(_a, this.currentResult.data);
                    (_d = (_c = this.options).onSettled) === null || _d === void 0 ? void 0 : _d.call(_c, this.currentResult.data, null);
                }
                else if (notifyOptions.onError) {
                    (_f = (_e = this.options).onError) === null || _f === void 0 ? void 0 : _f.call(_e, this.currentResult.error);
                    (_h = (_g = this.options).onSettled) === null || _h === void 0 ? void 0 : _h.call(_g, undefined, this.currentResult.error);
                }
                // Then trigger the listeners
                if (notifyOptions.listeners) {
                    this.listeners.forEach(listener => {
                        listener(this.currentResult);
                    });
                }
                // Then the cache listeners
                if (notifyOptions.cache) {
                    this.client
                        .getQueryCache()
                        .notify({ query: this.currentQuery, type: 'observerResultsUpdated' });
                }
            });
        }
    }
    function shouldLoadOnMount(query, options) {
        return (options.enabled !== false &&
            !query.state.dataUpdatedAt &&
            !(query.state.status === 'error' && options.retryOnMount === false));
    }
    function shouldRefetchOnMount(query, options) {
        return (options.enabled !== false &&
            query.state.dataUpdatedAt > 0 &&
            (options.refetchOnMount === 'always' ||
                (options.refetchOnMount !== false && isStale(query, options))));
    }
    function shouldFetchOnMount(query, options) {
        return (shouldLoadOnMount(query, options) || shouldRefetchOnMount(query, options));
    }
    function shouldFetchOnReconnect(query, options) {
        return (options.enabled !== false &&
            (options.refetchOnReconnect === 'always' ||
                (options.refetchOnReconnect !== false && isStale(query, options))));
    }
    function shouldFetchOnWindowFocus(query, options) {
        return (options.enabled !== false &&
            (options.refetchOnWindowFocus === 'always' ||
                (options.refetchOnWindowFocus !== false && isStale(query, options))));
    }
    function shouldFetchOptionally(query, prevQuery, options, prevOptions) {
        return (options.enabled !== false &&
            (query !== prevQuery || prevOptions.enabled === false) &&
            (!options.suspense || query.state.status !== 'error') &&
            isStale(query, options));
    }
    function isStale(query, options) {
        return query.isStaleByTime(options.staleTime);
    }

    // CLASS
    class QueryCache extends Subscribable {
        constructor(config) {
            super();
            this.config = config || {};
            this.queries = [];
            this.queriesMap = {};
        }
        build(client, options, state) {
            var _a;
            const queryKey = options.queryKey;
            const queryHash = (_a = options.queryHash) !== null && _a !== void 0 ? _a : hashQueryKeyByOptions(queryKey, options);
            let query = this.get(queryHash);
            if (!query) {
                query = new Query$2({
                    cache: this,
                    queryKey,
                    queryHash,
                    options: client.defaultQueryOptions(options),
                    state,
                    defaultOptions: client.getQueryDefaults(queryKey),
                    meta: options.meta,
                });
                this.add(query);
            }
            return query;
        }
        add(query) {
            if (!this.queriesMap[query.queryHash]) {
                this.queriesMap[query.queryHash] = query;
                this.queries.push(query);
                this.notify({
                    type: 'queryAdded',
                    query,
                });
            }
        }
        remove(query) {
            const queryInMap = this.queriesMap[query.queryHash];
            if (queryInMap) {
                query.destroy();
                this.queries = this.queries.filter(x => x !== query);
                if (queryInMap === query) {
                    delete this.queriesMap[query.queryHash];
                }
                this.notify({ type: 'queryRemoved', query });
            }
        }
        clear() {
            notifyManager.batch(() => {
                this.queries.forEach(query => {
                    this.remove(query);
                });
            });
        }
        get(queryHash) {
            return this.queriesMap[queryHash];
        }
        getAll() {
            return this.queries;
        }
        find(arg1, arg2) {
            const [filters] = parseFilterArgs(arg1, arg2);
            if (typeof filters.exact === 'undefined') {
                filters.exact = true;
            }
            return this.queries.find(query => matchQuery(filters, query));
        }
        findAll(arg1, arg2) {
            const [filters] = parseFilterArgs(arg1, arg2);
            return Object.keys(filters).length > 0
                ? this.queries.filter(query => matchQuery(filters, query))
                : this.queries;
        }
        notify(event) {
            notifyManager.batch(() => {
                this.listeners.forEach(listener => {
                    listener(event);
                });
            });
        }
        onFocus() {
            notifyManager.batch(() => {
                this.queries.forEach(query => {
                    query.onFocus();
                });
            });
        }
        onOnline() {
            notifyManager.batch(() => {
                this.queries.forEach(query => {
                    query.onOnline();
                });
            });
        }
    }

    // CLASS
    class Mutation {
        constructor(config) {
            this.options = Object.assign(Object.assign({}, config.defaultOptions), config.options);
            this.mutationId = config.mutationId;
            this.mutationCache = config.mutationCache;
            this.observers = [];
            this.state = config.state || getDefaultState();
            this.meta = config.meta;
        }
        setState(state) {
            this.dispatch({ type: 'setState', state });
        }
        addObserver(observer) {
            if (this.observers.indexOf(observer) === -1) {
                this.observers.push(observer);
            }
        }
        removeObserver(observer) {
            this.observers = this.observers.filter(x => x !== observer);
        }
        cancel() {
            if (this.retryer) {
                this.retryer.cancel();
                return this.retryer.promise.then(noop).catch(noop);
            }
            return Promise.resolve();
        }
        continue() {
            if (this.retryer) {
                this.retryer.continue();
                return this.retryer.promise;
            }
            return this.execute();
        }
        execute() {
            let data;
            const restored = this.state.status === 'loading';
            let promise = Promise.resolve();
            if (!restored) {
                this.dispatch({ type: 'loading', variables: this.options.variables });
                promise = promise
                    .then(() => {
                    var _a, _b;
                    // Notify cache callback
                    (_b = (_a = this.mutationCache.config).onMutate) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.variables, this);
                })
                    .then(() => { var _a, _b; return (_b = (_a = this.options).onMutate) === null || _b === void 0 ? void 0 : _b.call(_a, this.state.variables); })
                    .then(context => {
                    if (context !== this.state.context) {
                        this.dispatch({
                            type: 'loading',
                            context,
                            variables: this.state.variables,
                        });
                    }
                });
            }
            return promise
                .then(() => this.executeMutation())
                .then(result => {
                var _a, _b;
                data = result;
                // Notify cache callback
                (_b = (_a = this.mutationCache.config).onSuccess) === null || _b === void 0 ? void 0 : _b.call(_a, data, this.state.variables, this.state.context, this);
            })
                .then(() => { var _a, _b; return (_b = (_a = this.options).onSuccess) === null || _b === void 0 ? void 0 : _b.call(_a, data, this.state.variables, this.state.context); })
                .then(() => { var _a, _b; return (_b = (_a = this.options).onSettled) === null || _b === void 0 ? void 0 : _b.call(_a, data, null, this.state.variables, this.state.context); })
                .then(() => {
                this.dispatch({ type: 'success', data });
                return data;
            })
                .catch(error => {
                var _a, _b;
                // Notify cache callback
                (_b = (_a = this.mutationCache.config).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, this.state.variables, this.state.context, this);
                // Log error
                getLogger().error(error);
                return Promise.resolve()
                    .then(() => { var _a, _b; return (_b = (_a = this.options).onError) === null || _b === void 0 ? void 0 : _b.call(_a, error, this.state.variables, this.state.context); })
                    .then(() => { var _a, _b; return (_b = (_a = this.options).onSettled) === null || _b === void 0 ? void 0 : _b.call(_a, undefined, error, this.state.variables, this.state.context); })
                    .then(() => {
                    this.dispatch({ type: 'error', error });
                    throw error;
                });
            });
        }
        executeMutation() {
            var _a;
            this.retryer = new Retryer({
                fn: () => {
                    if (!this.options.mutationFn) {
                        return Promise.reject('No mutationFn found');
                    }
                    return this.options.mutationFn(this.state.variables);
                },
                onFail: () => {
                    this.dispatch({ type: 'failed' });
                },
                onPause: () => {
                    this.dispatch({ type: 'pause' });
                },
                onContinue: () => {
                    this.dispatch({ type: 'continue' });
                },
                retry: (_a = this.options.retry) !== null && _a !== void 0 ? _a : 0,
                retryDelay: this.options.retryDelay,
            });
            return this.retryer.promise;
        }
        dispatch(action) {
            this.state = reducer(this.state, action);
            notifyManager.batch(() => {
                this.observers.forEach(observer => {
                    observer.onMutationUpdate(action);
                });
                this.mutationCache.notify(this);
            });
        }
    }
    function getDefaultState() {
        return {
            context: undefined,
            data: undefined,
            error: null,
            failureCount: 0,
            isPaused: false,
            status: 'idle',
            variables: undefined,
        };
    }
    function reducer(state, action) {
        switch (action.type) {
            case 'failed':
                return Object.assign(Object.assign({}, state), { failureCount: state.failureCount + 1 });
            case 'pause':
                return Object.assign(Object.assign({}, state), { isPaused: true });
            case 'continue':
                return Object.assign(Object.assign({}, state), { isPaused: false });
            case 'loading':
                return Object.assign(Object.assign({}, state), { context: action.context, data: undefined, error: null, isPaused: false, status: 'loading', variables: action.variables });
            case 'success':
                return Object.assign(Object.assign({}, state), { data: action.data, error: null, status: 'success', isPaused: false });
            case 'error':
                return Object.assign(Object.assign({}, state), { data: undefined, error: action.error, failureCount: state.failureCount + 1, isPaused: false, status: 'error' });
            case 'setState':
                return Object.assign(Object.assign({}, state), action.state);
            default:
                return state;
        }
    }

    // CLASS
    class MutationCache extends Subscribable {
        constructor(config) {
            super();
            this.config = config || {};
            this.mutations = [];
            this.mutationId = 0;
        }
        build(client, options, state) {
            const mutation = new Mutation({
                mutationCache: this,
                mutationId: ++this.mutationId,
                options: client.defaultMutationOptions(options),
                state,
                defaultOptions: options.mutationKey
                    ? client.getMutationDefaults(options.mutationKey)
                    : undefined,
                meta: options.meta,
            });
            this.add(mutation);
            return mutation;
        }
        add(mutation) {
            this.mutations.push(mutation);
            this.notify(mutation);
        }
        remove(mutation) {
            this.mutations = this.mutations.filter(x => x !== mutation);
            mutation.cancel();
            this.notify(mutation);
        }
        clear() {
            notifyManager.batch(() => {
                this.mutations.forEach(mutation => {
                    this.remove(mutation);
                });
            });
        }
        getAll() {
            return this.mutations;
        }
        find(filters) {
            if (typeof filters.exact === 'undefined') {
                filters.exact = true;
            }
            return this.mutations.find(mutation => matchMutation(filters, mutation));
        }
        findAll(filters) {
            return this.mutations.filter(mutation => matchMutation(filters, mutation));
        }
        notify(mutation) {
            notifyManager.batch(() => {
                this.listeners.forEach(listener => {
                    listener(mutation);
                });
            });
        }
        onFocus() {
            this.resumePausedMutations();
        }
        onOnline() {
            this.resumePausedMutations();
        }
        resumePausedMutations() {
            const pausedMutations = this.mutations.filter(x => x.state.isPaused);
            return notifyManager.batch(() => pausedMutations.reduce((promise, mutation) => promise.then(() => mutation.continue().catch(noop)), Promise.resolve()));
        }
    }

    function infiniteQueryBehavior() {
        return {
            onFetch: context => {
                context.fetchFn = () => {
                    var _a, _b, _c, _d, _e, _f;
                    const refetchPage = (_b = (_a = context.fetchOptions) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.refetchPage;
                    const fetchMore = (_d = (_c = context.fetchOptions) === null || _c === void 0 ? void 0 : _c.meta) === null || _d === void 0 ? void 0 : _d.fetchMore;
                    const pageParam = fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.pageParam;
                    const isFetchingNextPage = (fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.direction) === 'forward';
                    const isFetchingPreviousPage = (fetchMore === null || fetchMore === void 0 ? void 0 : fetchMore.direction) === 'backward';
                    const oldPages = ((_e = context.state.data) === null || _e === void 0 ? void 0 : _e.pages) || [];
                    const oldPageParams = ((_f = context.state.data) === null || _f === void 0 ? void 0 : _f.pageParams) || [];
                    const abortController = getAbortController();
                    const abortSignal = abortController === null || abortController === void 0 ? void 0 : abortController.signal;
                    let newPageParams = oldPageParams;
                    let cancelled = false;
                    // Get query function
                    const queryFn = context.options.queryFn || (() => Promise.reject('Missing queryFn'));
                    const buildNewPages = (pages, param, page, previous) => {
                        newPageParams = previous
                            ? [param, ...newPageParams]
                            : [...newPageParams, param];
                        return previous ? [page, ...pages] : [...pages, page];
                    };
                    // Create function to fetch a page
                    const fetchPage = (pages, manual, param, previous) => {
                        if (cancelled) {
                            return Promise.reject('Cancelled');
                        }
                        if (typeof param === 'undefined' && !manual && pages.length) {
                            return Promise.resolve(pages);
                        }
                        const queryFnContext = {
                            queryKey: context.queryKey,
                            signal: abortSignal,
                            pageParam: param,
                            meta: context.meta,
                        };
                        const queryFnResult = queryFn(queryFnContext);
                        const promise = Promise.resolve(queryFnResult).then(page => buildNewPages(pages, param, page, previous));
                        if (isCancelable(queryFnResult)) {
                            const promiseAsAny = promise;
                            promiseAsAny.cancel = queryFnResult.cancel;
                        }
                        return promise;
                    };
                    let promise;
                    // Fetch first page?
                    if (!oldPages.length) {
                        promise = fetchPage([]);
                    }
                    // Fetch next page?
                    else if (isFetchingNextPage) {
                        const manual = typeof pageParam !== 'undefined';
                        const param = manual
                            ? pageParam
                            : getNextPageParam(context.options, oldPages);
                        promise = fetchPage(oldPages, manual, param);
                    }
                    // Fetch previous page?
                    else if (isFetchingPreviousPage) {
                        const manual = typeof pageParam !== 'undefined';
                        const param = manual
                            ? pageParam
                            : getPreviousPageParam(context.options, oldPages);
                        promise = fetchPage(oldPages, manual, param, true);
                    }
                    // Refetch pages
                    else {
                        newPageParams = [];
                        const manual = typeof context.options.getNextPageParam === 'undefined';
                        const shouldFetchFirstPage = refetchPage && oldPages[0]
                            ? refetchPage(oldPages[0], 0, oldPages)
                            : true;
                        // Fetch first page
                        promise = shouldFetchFirstPage
                            ? fetchPage([], manual, oldPageParams[0])
                            : Promise.resolve(buildNewPages([], oldPageParams[0], oldPages[0]));
                        // Fetch remaining pages
                        for (let i = 1; i < oldPages.length; i++) {
                            promise = promise.then(pages => {
                                const shouldFetchNextPage = refetchPage && oldPages[i]
                                    ? refetchPage(oldPages[i], i, oldPages)
                                    : true;
                                if (shouldFetchNextPage) {
                                    const param = manual
                                        ? oldPageParams[i]
                                        : getNextPageParam(context.options, pages);
                                    return fetchPage(pages, manual, param);
                                }
                                return Promise.resolve(buildNewPages(pages, oldPageParams[i], oldPages[i]));
                            });
                        }
                    }
                    const finalPromise = promise.then(pages => ({
                        pages,
                        pageParams: newPageParams,
                    }));
                    const finalPromiseAsAny = finalPromise;
                    finalPromiseAsAny.cancel = () => {
                        cancelled = true;
                        abortController === null || abortController === void 0 ? void 0 : abortController.abort();
                        if (isCancelable(promise)) {
                            promise.cancel();
                        }
                    };
                    return finalPromise;
                };
            },
        };
    }
    function getNextPageParam(options, pages) {
        var _a;
        return (_a = options.getNextPageParam) === null || _a === void 0 ? void 0 : _a.call(options, pages[pages.length - 1], pages);
    }
    function getPreviousPageParam(options, pages) {
        var _a;
        return (_a = options.getPreviousPageParam) === null || _a === void 0 ? void 0 : _a.call(options, pages[0], pages);
    }

    // CLASS
    class QueryClient {
        constructor(config = {}) {
            this.queryCache = config.queryCache || new QueryCache();
            this.mutationCache = config.mutationCache || new MutationCache();
            this.defaultOptions = config.defaultOptions || {};
            this.queryDefaults = [];
            this.mutationDefaults = [];
        }
        mount() {
            this.unsubscribeFocus = focusManager.subscribe(() => {
                if (focusManager.isFocused() && onlineManager.isOnline()) {
                    this.mutationCache.onFocus();
                    this.queryCache.onFocus();
                }
            });
            this.unsubscribeOnline = onlineManager.subscribe(() => {
                if (focusManager.isFocused() && onlineManager.isOnline()) {
                    this.mutationCache.onOnline();
                    this.queryCache.onOnline();
                }
            });
        }
        unmount() {
            var _a, _b;
            (_a = this.unsubscribeFocus) === null || _a === void 0 ? void 0 : _a.call(this);
            (_b = this.unsubscribeOnline) === null || _b === void 0 ? void 0 : _b.call(this);
        }
        isFetching(arg1, arg2) {
            const [filters] = parseFilterArgs(arg1, arg2);
            filters.fetching = true;
            return this.queryCache.findAll(filters).length;
        }
        isMutating(filters) {
            return this.mutationCache.findAll(Object.assign(Object.assign({}, filters), { fetching: true })).length;
        }
        getQueryData(queryKey, filters) {
            var _a;
            return (_a = this.queryCache.find(queryKey, filters)) === null || _a === void 0 ? void 0 : _a.state.data;
        }
        getQueriesData(queryKeyOrFilters) {
            return this.getQueryCache()
                .findAll(queryKeyOrFilters)
                .map(({ queryKey, state }) => {
                const data = state.data;
                return [queryKey, data];
            });
        }
        setQueryData(queryKey, updater, options) {
            const parsedOptions = parseQueryArgs(queryKey);
            const defaultedOptions = this.defaultQueryOptions(parsedOptions);
            return this.queryCache
                .build(this, defaultedOptions)
                .setData(updater, options);
        }
        setQueriesData(queryKeyOrFilters, updater, options) {
            return notifyManager.batch(() => this.getQueryCache()
                .findAll(queryKeyOrFilters)
                .map(({ queryKey }) => [
                queryKey,
                this.setQueryData(queryKey, updater, options),
            ]));
        }
        getQueryState(queryKey, filters) {
            var _a;
            return (_a = this.queryCache.find(queryKey, filters)) === null || _a === void 0 ? void 0 : _a.state;
        }
        removeQueries(arg1, arg2) {
            const [filters] = parseFilterArgs(arg1, arg2);
            const queryCache = this.queryCache;
            notifyManager.batch(() => {
                queryCache.findAll(filters).forEach(query => {
                    queryCache.remove(query);
                });
            });
        }
        resetQueries(arg1, arg2, arg3) {
            const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
            const queryCache = this.queryCache;
            const refetchFilters = Object.assign(Object.assign({}, filters), { active: true });
            return notifyManager.batch(() => {
                queryCache.findAll(filters).forEach(query => {
                    query.reset();
                });
                return this.refetchQueries(refetchFilters, options);
            });
        }
        cancelQueries(arg1, arg2, arg3) {
            const [filters, cancelOptions = {}] = parseFilterArgs(arg1, arg2, arg3);
            if (typeof cancelOptions.revert === 'undefined') {
                cancelOptions.revert = true;
            }
            const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map(query => query.cancel(cancelOptions)));
            return Promise.all(promises).then(noop).catch(noop);
        }
        invalidateQueries(arg1, arg2, arg3) {
            var _a, _b, _c;
            const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
            const refetchFilters = Object.assign(Object.assign({}, filters), { 
                // if filters.refetchActive is not provided and filters.active is explicitly false,
                // e.g. invalidateQueries({ active: false }), we don't want to refetch active queries
                active: (_b = (_a = filters.refetchActive) !== null && _a !== void 0 ? _a : filters.active) !== null && _b !== void 0 ? _b : true, inactive: (_c = filters.refetchInactive) !== null && _c !== void 0 ? _c : false });
            return notifyManager.batch(() => {
                this.queryCache.findAll(filters).forEach(query => {
                    query.invalidate();
                });
                return this.refetchQueries(refetchFilters, options);
            });
        }
        refetchQueries(arg1, arg2, arg3) {
            const [filters, options] = parseFilterArgs(arg1, arg2, arg3);
            const promises = notifyManager.batch(() => this.queryCache.findAll(filters).map(query => query.fetch(undefined, Object.assign(Object.assign({}, options), { meta: { refetchPage: filters === null || filters === void 0 ? void 0 : filters.refetchPage } }))));
            let promise = Promise.all(promises).then(noop);
            if (!(options === null || options === void 0 ? void 0 : options.throwOnError)) {
                promise = promise.catch(noop);
            }
            return promise;
        }
        fetchQuery(arg1, arg2, arg3) {
            const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
            const defaultedOptions = this.defaultQueryOptions(parsedOptions);
            // https://github.com/tannerlinsley/react-query/issues/652
            if (typeof defaultedOptions.retry === 'undefined') {
                defaultedOptions.retry = false;
            }
            const query = this.queryCache.build(this, defaultedOptions);
            return query.isStaleByTime(defaultedOptions.staleTime)
                ? query.fetch(defaultedOptions)
                : Promise.resolve(query.state.data);
        }
        prefetchQuery(arg1, arg2, arg3) {
            return this.fetchQuery(arg1, arg2, arg3)
                .then(noop)
                .catch(noop);
        }
        fetchInfiniteQuery(arg1, arg2, arg3) {
            const parsedOptions = parseQueryArgs(arg1, arg2, arg3);
            parsedOptions.behavior = infiniteQueryBehavior();
            return this.fetchQuery(parsedOptions);
        }
        prefetchInfiniteQuery(arg1, arg2, arg3) {
            return this.fetchInfiniteQuery(arg1, arg2, arg3)
                .then(noop)
                .catch(noop);
        }
        cancelMutations() {
            const promises = notifyManager.batch(() => this.mutationCache.getAll().map(mutation => mutation.cancel()));
            return Promise.all(promises).then(noop).catch(noop);
        }
        resumePausedMutations() {
            return this.getMutationCache().resumePausedMutations();
        }
        executeMutation(options) {
            return this.mutationCache.build(this, options).execute();
        }
        getQueryCache() {
            return this.queryCache;
        }
        getMutationCache() {
            return this.mutationCache;
        }
        getDefaultOptions() {
            return this.defaultOptions;
        }
        setDefaultOptions(options) {
            this.defaultOptions = options;
        }
        setQueryDefaults(queryKey, options) {
            const result = this.queryDefaults.find(x => hashQueryKey(queryKey) === hashQueryKey(x.queryKey));
            if (result) {
                result.defaultOptions = options;
            }
            else {
                this.queryDefaults.push({ queryKey, defaultOptions: options });
            }
        }
        getQueryDefaults(queryKey) {
            var _a;
            return queryKey
                ? (_a = this.queryDefaults.find(x => partialMatchKey(queryKey, x.queryKey))) === null || _a === void 0 ? void 0 : _a.defaultOptions : undefined;
        }
        setMutationDefaults(mutationKey, options) {
            const result = this.mutationDefaults.find(x => hashQueryKey(mutationKey) === hashQueryKey(x.mutationKey));
            if (result) {
                result.defaultOptions = options;
            }
            else {
                this.mutationDefaults.push({ mutationKey, defaultOptions: options });
            }
        }
        getMutationDefaults(mutationKey) {
            var _a;
            return mutationKey
                ? (_a = this.mutationDefaults.find(x => partialMatchKey(mutationKey, x.mutationKey))) === null || _a === void 0 ? void 0 : _a.defaultOptions : undefined;
        }
        defaultQueryOptions(options) {
            if (options === null || options === void 0 ? void 0 : options._defaulted) {
                return options;
            }
            const defaultedOptions = Object.assign(Object.assign(Object.assign(Object.assign({}, this.defaultOptions.queries), this.getQueryDefaults(options === null || options === void 0 ? void 0 : options.queryKey)), options), { _defaulted: true });
            if (!defaultedOptions.queryHash && defaultedOptions.queryKey) {
                defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
            }
            return defaultedOptions;
        }
        defaultQueryObserverOptions(options) {
            return this.defaultQueryOptions(options);
        }
        defaultMutationOptions(options) {
            if (options === null || options === void 0 ? void 0 : options._defaulted) {
                return options;
            }
            return Object.assign(Object.assign(Object.assign(Object.assign({}, this.defaultOptions.mutations), this.getMutationDefaults(options === null || options === void 0 ? void 0 : options.mutationKey)), options), { _defaulted: true });
        }
        clear() {
            this.queryCache.clear();
            this.mutationCache.clear();
        }
    }

    var svelte = /*#__PURE__*/Object.freeze({
        __proto__: null,
        SvelteComponent: SvelteComponentDev,
        SvelteComponentTyped: SvelteComponentTyped,
        afterUpdate: afterUpdate,
        beforeUpdate: beforeUpdate,
        createEventDispatcher: createEventDispatcher,
        getAllContexts: getAllContexts,
        getContext: getContext,
        hasContext: hasContext,
        onDestroy: onDestroy,
        onMount: onMount,
        setContext: setContext,
        tick: tick
    });

    /* node_modules\@sveltestack\svelte-query\svelte\queryClientProvider\QueryClientProvider.svelte generated by Svelte v3.47.0 */

    function create_fragment$r(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QueryClientProvider', slots, ['default']);
    	let { queryCache = new QueryCache() } = $$props;
    	let { mutationCache = new MutationCache() } = $$props;
    	let { defaultOptions = {} } = $$props;

    	let { client = new QueryClient({
    			queryCache,
    			mutationCache,
    			defaultOptions
    		}) } = $$props;

    	onMount(() => {
    		client.mount();
    	});

    	setContext('queryClient', client);

    	onDestroy(() => {
    		client.unmount();
    	});

    	const writable_props = ['queryCache', 'mutationCache', 'defaultOptions', 'client'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QueryClientProvider> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('queryCache' in $$props) $$invalidate(0, queryCache = $$props.queryCache);
    		if ('mutationCache' in $$props) $$invalidate(1, mutationCache = $$props.mutationCache);
    		if ('defaultOptions' in $$props) $$invalidate(2, defaultOptions = $$props.defaultOptions);
    		if ('client' in $$props) $$invalidate(3, client = $$props.client);
    		if ('$$scope' in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		onDestroy,
    		MutationCache,
    		QueryCache,
    		QueryClient,
    		queryCache,
    		mutationCache,
    		defaultOptions,
    		client
    	});

    	$$self.$inject_state = $$props => {
    		if ('queryCache' in $$props) $$invalidate(0, queryCache = $$props.queryCache);
    		if ('mutationCache' in $$props) $$invalidate(1, mutationCache = $$props.mutationCache);
    		if ('defaultOptions' in $$props) $$invalidate(2, defaultOptions = $$props.defaultOptions);
    		if ('client' in $$props) $$invalidate(3, client = $$props.client);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [queryCache, mutationCache, defaultOptions, client, $$scope, slots];
    }

    class QueryClientProvider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			queryCache: 0,
    			mutationCache: 1,
    			defaultOptions: 2,
    			client: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QueryClientProvider",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get queryCache() {
    		throw new Error("<QueryClientProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set queryCache(value) {
    		throw new Error("<QueryClientProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mutationCache() {
    		throw new Error("<QueryClientProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mutationCache(value) {
    		throw new Error("<QueryClientProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get defaultOptions() {
    		throw new Error("<QueryClientProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set defaultOptions(value) {
    		throw new Error("<QueryClientProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get client() {
    		throw new Error("<QueryClientProvider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set client(value) {
    		throw new Error("<QueryClientProvider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var QueryClientProvider$1 = QueryClientProvider;

    function useQueryClient() {
        const queryClient = getContext('queryClient');
        if (!queryClient) {
            throw new Error('No QueryClient set, use QueryClientProvider to set one');
        }
        return queryClient;
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$1) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$1) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop$1;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function setBatchCalls(options) {
        // Make sure results are optimistically set in fetching state before subscribing or updating options
        options.optimisticResults = true;
        if (options.onError) {
            options.onError = notifyManager.batchCalls(options.onError);
        }
        if (options.onSuccess) {
            options.onSuccess = notifyManager.batchCalls(options.onSuccess);
        }
        if (options.onSettled) {
            options.onSettled = notifyManager.batchCalls(options.onSettled);
        }
        return options;
    }

    /* eslint-disable no-shadow */
    function useQuery(arg1, arg2, arg3) {
        const options = parseQueryArgs(arg1, arg2, arg3);
        const client = useQueryClient();
        let defaultedOptions = client.defaultQueryObserverOptions(options);
        // Include callbacks in batch renders
        defaultedOptions = setBatchCalls(defaultedOptions);
        const observer = new QueryObserver(client, defaultedOptions);
        const { subscribe } = readable(observer.getCurrentResult(), set => {
            return observer.subscribe(notifyManager.batchCalls(set));
        });
        // Update result to make sure we did not miss any query updates
        // between creating the observer and subscribing to it.
        observer.updateResult();
        function setOptions(arg1, arg2, arg3) {
            const options = parseQueryArgs(arg1, arg2, arg3);
            let defaultedOptions = client.defaultQueryObserverOptions(options);
            // Include callbacks in batch renders
            defaultedOptions = setBatchCalls(defaultedOptions);
            if (observer.hasListeners()) {
                observer.setOptions(defaultedOptions, { listeners: false });
            }
        }
        function updateOptions(options) {
            observer.updateOptions(options);
        }
        function setEnabled(enabled) {
            updateOptions({ enabled });
        }
        return { subscribe, setOptions, updateOptions, setEnabled };
    }

    /* node_modules\@sveltestack\svelte-query\svelte\query\Query.svelte generated by Svelte v3.47.0 */
    const get_query_slot_changes = dirty => ({ queryResult: dirty & /*queryResult*/ 1 });
    const get_query_slot_context = ctx => ({ queryResult: /*queryResult*/ ctx[0] });

    function create_fragment$q(ctx) {
    	let current;
    	const query_slot_template = /*#slots*/ ctx[6].query;
    	const query_slot = create_slot(query_slot_template, ctx, /*$$scope*/ ctx[5], get_query_slot_context);

    	const block = {
    		c: function create() {
    			if (query_slot) query_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (query_slot) {
    				query_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (query_slot) {
    				if (query_slot.p && (!current || dirty & /*$$scope, queryResult*/ 33)) {
    					update_slot_base(
    						query_slot,
    						query_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(query_slot_template, /*$$scope*/ ctx[5], dirty, get_query_slot_changes),
    						get_query_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(query_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(query_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (query_slot) query_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	let $query;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Query', slots, ['query']);
    	let { options } = $$props;
    	let { queryResult = undefined } = $$props;
    	let firstRender = true;

    	onMount(() => {
    		$$invalidate(3, firstRender = false);
    	});

    	const query = useQuery(options);
    	validate_store(query, 'query');
    	component_subscribe($$self, query, value => $$invalidate(4, $query = value));
    	const writable_props = ['options', 'queryResult'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Query> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('queryResult' in $$props) $$invalidate(0, queryResult = $$props.queryResult);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		useQuery,
    		options,
    		queryResult,
    		firstRender,
    		query,
    		$query
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('queryResult' in $$props) $$invalidate(0, queryResult = $$props.queryResult);
    		if ('firstRender' in $$props) $$invalidate(3, firstRender = $$props.firstRender);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$query*/ 16) {
    			$$invalidate(0, queryResult = $query);
    		}

    		if ($$self.$$.dirty & /*firstRender, options*/ 12) {
    			{
    				if (!firstRender) {
    					query.setOptions(options);
    				}
    			}
    		}
    	};

    	return [queryResult, query, options, firstRender, $query, $$scope, slots];
    }

    class Query extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { options: 2, queryResult: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Query",
    			options,
    			id: create_fragment$q.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*options*/ ctx[2] === undefined && !('options' in props)) {
    			console.warn("<Query> was created without expected prop 'options'");
    		}
    	}

    	get options() {
    		throw new Error("<Query>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<Query>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get queryResult() {
    		throw new Error("<Query>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set queryResult(value) {
    		throw new Error("<Query>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Query$1 = Query;

    const isSearching = writable('');
    const SearchTerm = writable('');
    const seeMore = writable('');
    const MoreField = writable('');
    const fields = writable('');
    const cols = writable(['title', 'product', 'pdf']);
    const selection = writable(1);
    const seecol = writable(false);
    const fieldID = writable('');
    const viewfield = writable(false);
    const pages = writable(1);
    const category = writable(1);

    /* src\components\NoResult.svelte generated by Svelte v3.47.0 */
    const file$p = "src\\components\\NoResult.svelte";

    // (36:8) {:else}
    function create_else_block$9(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let h2;
    	let t2;
    	let p;
    	let t3;
    	let button;
    	let t4;
    	let t5;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			h2 = element("h2");
    			h2.textContent = "No results found.";
    			t2 = space();
    			p = element("p");
    			t3 = text("Did you mean ");
    			button = element("button");
    			t4 = text(/*suggestion*/ ctx[0]);
    			t5 = text("? You can also try another keyword or filter by your industry\r\n            below:");
    			attr_dev(img, "class", "image svelte-19bcstx");
    			if (!src_url_equal(img.src, img_src_value = "data:image/svg+xml,%3csvg id='robot' xmlns='http://www.w3.org/2000/svg' width='307.956' height='251.281' viewBox='0 0 307.956 251.281'%3e %3cdefs%3e %3cstyle%3e .cls-1%2c .cls-13 %7b fill: %233b9ae2%3b %7d .cls-1%2c .cls-10%2c .cls-11%2c .cls-12%2c .cls-13%2c .cls-14%2c .cls-15%2c .cls-16%2c .cls-17%2c .cls-2%2c .cls-3%2c .cls-4%2c .cls-5%2c .cls-7%2c .cls-8%2c .cls-9 %7b fill-rule: evenodd%3b %7d .cls-2 %7b fill: %23e7eef3%3b %7d .cls-3 %7b fill: %23ffa811%3b %7d .cls-4 %7b fill: %23fc1%3b %7d .cls-5%2c .cls-6 %7b fill: %23063060%3b %7d .cls-11%2c .cls-7%2c .cls-9 %7b fill: none%3b %7d .cls-7 %7b stroke: %23063060%3b %7d .cls-11%2c .cls-13%2c .cls-14%2c .cls-15%2c .cls-7%2c .cls-8%2c .cls-9 %7b stroke-linecap: round%3b %7d .cls-13%2c .cls-14%2c .cls-15%2c .cls-7%2c .cls-8 %7b stroke-width: 4.275px%3b %7d .cls-10%2c .cls-14%2c .cls-8 %7b fill: %23252525%3b %7d .cls-8 %7b stroke: white%3b %7d .cls-14%2c .cls-15%2c .cls-9 %7b stroke: %23252525%3b %7d .cls-9 %7b stroke-width: 3.206px%3b %7d .cls-11 %7b stroke: %23787d92%3b stroke-width: 10.687px%3b %7d .cls-12 %7b fill: %23787d92%3b %7d .cls-13 %7b stroke: %23ffca09%3b %7d .cls-14%2c .cls-15 %7b stroke-linejoin: round%3b %7d .cls-15 %7b fill: %23ca2c2c%3b %7d .cls-16 %7b fill: %23ffca09%3b %7d .cls-17 %7b fill: white%3b %7d %3c/style%3e %3c/defs%3e %3cg id='robothead'%3e %3cpath id='Rounded_Rectangle_2' data-name='Rounded Rectangle 2' class='cls-1' d='M81.417%2c1.477H201.45a27.729%2c27.729%2c0%2c0%2c1%2c27.7%2c27.757v74.019a27.729%2c27.729%2c0%2c0%2c1-27.7%2c27.757H81.417a27.728%2c27.728%2c0%2c0%2c1-27.7-27.757V29.234A27.729%2c27.729%2c0%2c0%2c1%2c81.417%2c1.477Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_2_copy' data-name='Rounded Rectangle 2 copy' class='cls-2' d='M87.572-4.692H207.605a27.728%2c27.728%2c0%2c0%2c1%2c27.7%2c27.757V97.085a27.728%2c27.728%2c0%2c0%2c1-27.7%2c27.757H87.572a27.728%2c27.728%2c0%2c0%2c1-27.7-27.757V23.066A27.729%2c27.729%2c0%2c0%2c1%2c87.572-4.692Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_3' data-name='Rounded Rectangle 3' class='cls-3' d='M109.042%2c16.9h80.171a30.717%2c30.717%2c0%2c0%2c1%2c30.7%2c30.731V81.774a30.717%2c30.717%2c0%2c0%2c1-30.7%2c30.731H109.042a30.717%2c30.717%2c0%2c0%2c1-30.7-30.731V47.628A30.717%2c30.717%2c0%2c0%2c1%2c109.042%2c16.9Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_3_copy' data-name='Rounded Rectangle 3 copy' class='cls-4' d='M124.431%2c16.9H204.6a30.717%2c30.717%2c0%2c0%2c1%2c30.7%2c30.731V81.774a30.717%2c30.717%2c0%2c0%2c1-30.7%2c30.731H124.431a30.717%2c30.717%2c0%2c0%2c1-30.7-30.731V47.628A30.717%2c30.717%2c0%2c0%2c1%2c124.431%2c16.9Z' transform='translate(-1.156)'/%3e %3cpath class='cls-5' d='M124.913%2c43.167a11.1%2c11.1%2c0%2c1%2c1-11.087%2c11.1A11.093%2c11.093%2c0%2c0%2c1%2c124.913%2c43.167Z' transform='translate(-1.156)'/%3e %3ccircle id='Ellipse_6_copy' data-name='Ellipse 6 copy' class='cls-6' cx='195.406' cy='54.266' r='11.094'/%3e %3cpath class='cls-7' d='M126.044%2c80.122s22.058-7.71%2c46.167%2c6.168' transform='translate(-1.156)'/%3e %3cpath class='cls-8' d='M52.947%2c54.8A19.928%2c19.928%2c0%2c1%2c1%2c33.06%2c74.725%2c19.908%2c19.908%2c0%2c0%2c1%2c52.947%2c54.8Z' transform='translate(-1.156)'/%3e %3cpath class='cls-9' d='M93.375%2c88.519L46.119%2c75.83' transform='translate(-1.156)'/%3e %3cpath class='cls-10' d='M96.036%2c83.206a6.939%2c6.939%2c0%2c1%2c1-6.925%2c6.939A6.932%2c6.932%2c0%2c0%2c1%2c96.036%2c83.206Z' transform='translate(-1.156)'/%3e %3c/g%3e %3cpath class='cls-11' d='M188.226%2c163.915s33.327%2c26.327%2c67.4-18.38' transform='translate(-1.156)'/%3e %3cpath class='cls-12' d='M251.464%2c127.926a25.444%2c25.444%2c0%2c1%2c1-25.392%2c25.444A25.418%2c25.418%2c0%2c0%2c1%2c251.464%2c127.926Z' transform='translate(-1.156)'/%3e %3cg id='TORSO'%3e %3cpath id='Rounded_Rectangle_4_copy_2' data-name='Rounded Rectangle 4 copy 2' class='cls-1' d='M109.787%2c220.45h20.2a14.651%2c14.651%2c0%2c0%2c1%2c14.521%2c14.778v1.285a14.652%2c14.652%2c0%2c0%2c1-14.521%2c14.779h-20.2a14.652%2c14.652%2c0%2c0%2c1-14.52-14.779v-1.285A14.652%2c14.652%2c0%2c0%2c1%2c109.787%2c220.45Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_4_copy_3' data-name='Rounded Rectangle 4 copy 3' class='cls-2' d='M120.56%2c220.45h20.2a14.651%2c14.651%2c0%2c0%2c1%2c14.521%2c14.778v1.285a14.652%2c14.652%2c0%2c0%2c1-14.521%2c14.779h-20.2a14.652%2c14.652%2c0%2c0%2c1-14.521-14.779v-1.285A14.651%2c14.651%2c0%2c0%2c1%2c120.56%2c220.45Z' transform='translate(-1.156)'/%3e %3cpath class='cls-13' d='M78.339%2c246.665H27.556' transform='translate(-1.156)'/%3e %3cpath id='Shape_5_copy' data-name='Shape 5 copy' class='cls-13' d='M13.335%2c246.665H3.3' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_4' data-name='Rounded Rectangle 4' class='cls-1' d='M110.655%2c138.721H159.9a35.43%2c35.43%2c0%2c0%2c1%2c35.394%2c35.467v3.084A35.431%2c35.431%2c0%2c0%2c1%2c159.9%2c212.74H110.655a35.431%2c35.431%2c0%2c0%2c1-35.394-35.468v-3.084A35.431%2c35.431%2c0%2c0%2c1%2c110.655%2c138.721Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_4_copy' data-name='Rounded Rectangle 4 copy' class='cls-2' d='M127.583%2c138.721h49.245a35.431%2c35.431%2c0%2c0%2c1%2c35.394%2c35.467v3.084a35.432%2c35.432%2c0%2c0%2c1-35.394%2c35.468H127.583a35.431%2c35.431%2c0%2c0%2c1-35.394-35.468v-3.084A35.43%2c35.43%2c0%2c0%2c1%2c127.583%2c138.721Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_6' data-name='Rounded Rectangle 6' class='cls-4' d='M109.886%2c178.814h10.772a3.856%2c3.856%2c0%2c0%2c1%2c0%2c7.711H109.886A3.856%2c3.856%2c0%2c0%2c1%2c109.886%2c178.814Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_5' data-name='Rounded Rectangle 5' class='cls-4' d='M108.347%2c160.309h26.161a5.4%2c5.4%2c0%2c0%2c1%2c0%2c10.8H108.347A5.4%2c5.4%2c0%2c0%2c1%2c108.347%2c160.309Z' transform='translate(-1.156)'/%3e %3c/g%3e %3cg%3e %3cpath id='Rounded_Rectangle_7_copy' data-name='Rounded Rectangle 7 copy' class='cls-14' d='M261.509%2c104.1l37.347%2c10a6.815%2c6.815%2c0%2c0%2c1%2c4.825%2c8.347l-12.362%2c46.081a6.825%2c6.825%2c0%2c0%2c1-8.357%2c4.819l-37.347-10A6.815%2c6.815%2c0%2c0%2c1%2c240.79%2c155l12.362-46.081A6.825%2c6.825%2c0%2c0%2c1%2c261.509%2c104.1Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_7' data-name='Rounded Rectangle 7' class='cls-15' d='M264.587%2c90.222l37.347%2c10a6.815%2c6.815%2c0%2c0%2c1%2c4.825%2c8.347L294.4%2c154.645a6.824%2c6.824%2c0%2c0%2c1-8.357%2c4.819l-37.347-10a6.816%2c6.816%2c0%2c0%2c1-4.825-8.347L256.23%2c95.041A6.824%2c6.824%2c0%2c0%2c1%2c264.587%2c90.222Z' transform='translate(-1.156)'/%3e %3cpath class='cls-16' d='M263.005%2c158.767a4.627%2c4.627%2c0%2c1%2c1-4.616%2c4.627A4.622%2c4.622%2c0%2c0%2c1%2c263.005%2c158.767Z' transform='translate(-1.156)'/%3e %3cpath id='_' data-name='%3f' class='cls-17' d='M270.351%2c128.525l6.9%2c2.062%2c1.148-3.794c5.847%2c0.369%2c11.064-2.725%2c12.5-7.468%2c1.8-5.954-1.757-11.786-8.813-13.9a17.183%2c17.183%2c0%2c0%2c0-14.189%2c1.963l3.086%2c5.864a9.614%2c9.614%2c0%2c0%2c1%2c7.673-1.268c3.236%2c0.967%2c4.732%2c3.483%2c4.062%2c5.7-0.765%2c2.529-4.8%2c3.448-9.748%2c2.2Zm-0.5%2c14.1a5.065%2c5.065%2c0%2c0%2c0%2c6.2-3.489%2c4.978%2c4.978%2c0%2c0%2c0-3.3-6.1A5.011%2c5.011%2c0%2c1%2c0%2c269.846%2c142.623Z' transform='translate(-1.156)'/%3e %3c/g%3e%3c/svg%3e")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Sad robot");
    			attr_dev(img, "height", "130");
    			add_location(img, file$p, 37, 12, 8457);
    			attr_dev(div, "class", "image-wrapper svelte-19bcstx");
    			add_location(div, file$p, 36, 10, 8401);
    			attr_dev(h2, "class", "heading svelte-19bcstx svelte-1m4okdq");
    			add_location(h2, file$p, 45, 10, 15958);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "link svelte-1yo2ena primary svelte-1m4okdq");
    			add_location(button, file$p, 48, 25, 16090);
    			attr_dev(p, "class", "message svelte-19bcstx svelte-1m4okdq");
    			add_location(p, file$p, 47, 10, 16029);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t3);
    			append_dev(p, button);
    			append_dev(button, t4);
    			append_dev(p, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*suggestion*/ 1) set_data_dev(t4, /*suggestion*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(36:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:8) {#if suggestion == undefined}
    function create_if_block$e(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let h2;
    	let t2;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			h2 = element("h2");
    			h2.textContent = "No results found.";
    			t2 = space();
    			p = element("p");
    			p.textContent = "You can also try another keyword or filter by your industry above";
    			attr_dev(img, "class", "image svelte-19bcstx");
    			if (!src_url_equal(img.src, img_src_value = "data:image/svg+xml,%3csvg id='robot' xmlns='http://www.w3.org/2000/svg' width='307.956' height='251.281' viewBox='0 0 307.956 251.281'%3e %3cdefs%3e %3cstyle%3e .cls-1%2c .cls-13 %7b fill: %233b9ae2%3b %7d .cls-1%2c .cls-10%2c .cls-11%2c .cls-12%2c .cls-13%2c .cls-14%2c .cls-15%2c .cls-16%2c .cls-17%2c .cls-2%2c .cls-3%2c .cls-4%2c .cls-5%2c .cls-7%2c .cls-8%2c .cls-9 %7b fill-rule: evenodd%3b %7d .cls-2 %7b fill: %23e7eef3%3b %7d .cls-3 %7b fill: %23ffa811%3b %7d .cls-4 %7b fill: %23fc1%3b %7d .cls-5%2c .cls-6 %7b fill: %23063060%3b %7d .cls-11%2c .cls-7%2c .cls-9 %7b fill: none%3b %7d .cls-7 %7b stroke: %23063060%3b %7d .cls-11%2c .cls-13%2c .cls-14%2c .cls-15%2c .cls-7%2c .cls-8%2c .cls-9 %7b stroke-linecap: round%3b %7d .cls-13%2c .cls-14%2c .cls-15%2c .cls-7%2c .cls-8 %7b stroke-width: 4.275px%3b %7d .cls-10%2c .cls-14%2c .cls-8 %7b fill: %23252525%3b %7d .cls-8 %7b stroke: white%3b %7d .cls-14%2c .cls-15%2c .cls-9 %7b stroke: %23252525%3b %7d .cls-9 %7b stroke-width: 3.206px%3b %7d .cls-11 %7b stroke: %23787d92%3b stroke-width: 10.687px%3b %7d .cls-12 %7b fill: %23787d92%3b %7d .cls-13 %7b stroke: %23ffca09%3b %7d .cls-14%2c .cls-15 %7b stroke-linejoin: round%3b %7d .cls-15 %7b fill: %23ca2c2c%3b %7d .cls-16 %7b fill: %23ffca09%3b %7d .cls-17 %7b fill: white%3b %7d %3c/style%3e %3c/defs%3e %3cg id='robothead'%3e %3cpath id='Rounded_Rectangle_2' data-name='Rounded Rectangle 2' class='cls-1' d='M81.417%2c1.477H201.45a27.729%2c27.729%2c0%2c0%2c1%2c27.7%2c27.757v74.019a27.729%2c27.729%2c0%2c0%2c1-27.7%2c27.757H81.417a27.728%2c27.728%2c0%2c0%2c1-27.7-27.757V29.234A27.729%2c27.729%2c0%2c0%2c1%2c81.417%2c1.477Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_2_copy' data-name='Rounded Rectangle 2 copy' class='cls-2' d='M87.572-4.692H207.605a27.728%2c27.728%2c0%2c0%2c1%2c27.7%2c27.757V97.085a27.728%2c27.728%2c0%2c0%2c1-27.7%2c27.757H87.572a27.728%2c27.728%2c0%2c0%2c1-27.7-27.757V23.066A27.729%2c27.729%2c0%2c0%2c1%2c87.572-4.692Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_3' data-name='Rounded Rectangle 3' class='cls-3' d='M109.042%2c16.9h80.171a30.717%2c30.717%2c0%2c0%2c1%2c30.7%2c30.731V81.774a30.717%2c30.717%2c0%2c0%2c1-30.7%2c30.731H109.042a30.717%2c30.717%2c0%2c0%2c1-30.7-30.731V47.628A30.717%2c30.717%2c0%2c0%2c1%2c109.042%2c16.9Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_3_copy' data-name='Rounded Rectangle 3 copy' class='cls-4' d='M124.431%2c16.9H204.6a30.717%2c30.717%2c0%2c0%2c1%2c30.7%2c30.731V81.774a30.717%2c30.717%2c0%2c0%2c1-30.7%2c30.731H124.431a30.717%2c30.717%2c0%2c0%2c1-30.7-30.731V47.628A30.717%2c30.717%2c0%2c0%2c1%2c124.431%2c16.9Z' transform='translate(-1.156)'/%3e %3cpath class='cls-5' d='M124.913%2c43.167a11.1%2c11.1%2c0%2c1%2c1-11.087%2c11.1A11.093%2c11.093%2c0%2c0%2c1%2c124.913%2c43.167Z' transform='translate(-1.156)'/%3e %3ccircle id='Ellipse_6_copy' data-name='Ellipse 6 copy' class='cls-6' cx='195.406' cy='54.266' r='11.094'/%3e %3cpath class='cls-7' d='M126.044%2c80.122s22.058-7.71%2c46.167%2c6.168' transform='translate(-1.156)'/%3e %3cpath class='cls-8' d='M52.947%2c54.8A19.928%2c19.928%2c0%2c1%2c1%2c33.06%2c74.725%2c19.908%2c19.908%2c0%2c0%2c1%2c52.947%2c54.8Z' transform='translate(-1.156)'/%3e %3cpath class='cls-9' d='M93.375%2c88.519L46.119%2c75.83' transform='translate(-1.156)'/%3e %3cpath class='cls-10' d='M96.036%2c83.206a6.939%2c6.939%2c0%2c1%2c1-6.925%2c6.939A6.932%2c6.932%2c0%2c0%2c1%2c96.036%2c83.206Z' transform='translate(-1.156)'/%3e %3c/g%3e %3cpath class='cls-11' d='M188.226%2c163.915s33.327%2c26.327%2c67.4-18.38' transform='translate(-1.156)'/%3e %3cpath class='cls-12' d='M251.464%2c127.926a25.444%2c25.444%2c0%2c1%2c1-25.392%2c25.444A25.418%2c25.418%2c0%2c0%2c1%2c251.464%2c127.926Z' transform='translate(-1.156)'/%3e %3cg id='TORSO'%3e %3cpath id='Rounded_Rectangle_4_copy_2' data-name='Rounded Rectangle 4 copy 2' class='cls-1' d='M109.787%2c220.45h20.2a14.651%2c14.651%2c0%2c0%2c1%2c14.521%2c14.778v1.285a14.652%2c14.652%2c0%2c0%2c1-14.521%2c14.779h-20.2a14.652%2c14.652%2c0%2c0%2c1-14.52-14.779v-1.285A14.652%2c14.652%2c0%2c0%2c1%2c109.787%2c220.45Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_4_copy_3' data-name='Rounded Rectangle 4 copy 3' class='cls-2' d='M120.56%2c220.45h20.2a14.651%2c14.651%2c0%2c0%2c1%2c14.521%2c14.778v1.285a14.652%2c14.652%2c0%2c0%2c1-14.521%2c14.779h-20.2a14.652%2c14.652%2c0%2c0%2c1-14.521-14.779v-1.285A14.651%2c14.651%2c0%2c0%2c1%2c120.56%2c220.45Z' transform='translate(-1.156)'/%3e %3cpath class='cls-13' d='M78.339%2c246.665H27.556' transform='translate(-1.156)'/%3e %3cpath id='Shape_5_copy' data-name='Shape 5 copy' class='cls-13' d='M13.335%2c246.665H3.3' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_4' data-name='Rounded Rectangle 4' class='cls-1' d='M110.655%2c138.721H159.9a35.43%2c35.43%2c0%2c0%2c1%2c35.394%2c35.467v3.084A35.431%2c35.431%2c0%2c0%2c1%2c159.9%2c212.74H110.655a35.431%2c35.431%2c0%2c0%2c1-35.394-35.468v-3.084A35.431%2c35.431%2c0%2c0%2c1%2c110.655%2c138.721Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_4_copy' data-name='Rounded Rectangle 4 copy' class='cls-2' d='M127.583%2c138.721h49.245a35.431%2c35.431%2c0%2c0%2c1%2c35.394%2c35.467v3.084a35.432%2c35.432%2c0%2c0%2c1-35.394%2c35.468H127.583a35.431%2c35.431%2c0%2c0%2c1-35.394-35.468v-3.084A35.43%2c35.43%2c0%2c0%2c1%2c127.583%2c138.721Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_6' data-name='Rounded Rectangle 6' class='cls-4' d='M109.886%2c178.814h10.772a3.856%2c3.856%2c0%2c0%2c1%2c0%2c7.711H109.886A3.856%2c3.856%2c0%2c0%2c1%2c109.886%2c178.814Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_5' data-name='Rounded Rectangle 5' class='cls-4' d='M108.347%2c160.309h26.161a5.4%2c5.4%2c0%2c0%2c1%2c0%2c10.8H108.347A5.4%2c5.4%2c0%2c0%2c1%2c108.347%2c160.309Z' transform='translate(-1.156)'/%3e %3c/g%3e %3cg%3e %3cpath id='Rounded_Rectangle_7_copy' data-name='Rounded Rectangle 7 copy' class='cls-14' d='M261.509%2c104.1l37.347%2c10a6.815%2c6.815%2c0%2c0%2c1%2c4.825%2c8.347l-12.362%2c46.081a6.825%2c6.825%2c0%2c0%2c1-8.357%2c4.819l-37.347-10A6.815%2c6.815%2c0%2c0%2c1%2c240.79%2c155l12.362-46.081A6.825%2c6.825%2c0%2c0%2c1%2c261.509%2c104.1Z' transform='translate(-1.156)'/%3e %3cpath id='Rounded_Rectangle_7' data-name='Rounded Rectangle 7' class='cls-15' d='M264.587%2c90.222l37.347%2c10a6.815%2c6.815%2c0%2c0%2c1%2c4.825%2c8.347L294.4%2c154.645a6.824%2c6.824%2c0%2c0%2c1-8.357%2c4.819l-37.347-10a6.816%2c6.816%2c0%2c0%2c1-4.825-8.347L256.23%2c95.041A6.824%2c6.824%2c0%2c0%2c1%2c264.587%2c90.222Z' transform='translate(-1.156)'/%3e %3cpath class='cls-16' d='M263.005%2c158.767a4.627%2c4.627%2c0%2c1%2c1-4.616%2c4.627A4.622%2c4.622%2c0%2c0%2c1%2c263.005%2c158.767Z' transform='translate(-1.156)'/%3e %3cpath id='_' data-name='%3f' class='cls-17' d='M270.351%2c128.525l6.9%2c2.062%2c1.148-3.794c5.847%2c0.369%2c11.064-2.725%2c12.5-7.468%2c1.8-5.954-1.757-11.786-8.813-13.9a17.183%2c17.183%2c0%2c0%2c0-14.189%2c1.963l3.086%2c5.864a9.614%2c9.614%2c0%2c0%2c1%2c7.673-1.268c3.236%2c0.967%2c4.732%2c3.483%2c4.062%2c5.7-0.765%2c2.529-4.8%2c3.448-9.748%2c2.2Zm-0.5%2c14.1a5.065%2c5.065%2c0%2c0%2c0%2c6.2-3.489%2c4.978%2c4.978%2c0%2c0%2c0-3.3-6.1A5.011%2c5.011%2c0%2c1%2c0%2c269.846%2c142.623Z' transform='translate(-1.156)'/%3e %3c/g%3e%3c/svg%3e")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Sad robot");
    			attr_dev(img, "height", "130");
    			add_location(img, file$p, 22, 12, 671);
    			attr_dev(div, "class", "image-wrapper svelte-19bcstx");
    			add_location(div, file$p, 21, 10, 615);
    			attr_dev(h2, "class", "heading svelte-19bcstx svelte-1m4okdq");
    			add_location(h2, file$p, 30, 10, 8172);
    			attr_dev(p, "class", "message svelte-19bcstx svelte-1m4okdq");
    			add_location(p, file$p, 32, 10, 8243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(21:8) {#if suggestion == undefined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div2;
    	let div1;
    	let form;
    	let div0;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*suggestion*/ ctx[0] == undefined) return create_if_block$e;
    		return create_else_block$9;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			form = element("form");
    			div0 = element("div");
    			if_block.c();
    			add_location(div0, file$p, 19, 6, 559);
    			add_location(form, file$p, 18, 4, 503);
    			attr_dev(div1, "class", "wrapper svelte-19bcstx svelte-1m4okdq");
    			add_location(div1, file$p, 17, 2, 461);
    			attr_dev(div2, "class", "no-results svelte-19bcstx svelte-1m4okdq");
    			add_location(div2, file$p, 16, 0, 418);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, form);
    			append_dev(form, div0);
    			if_block.m(div0, null);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleOnSubmit*/ ctx[1]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	let $SearchTerm;
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(2, $SearchTerm = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NoResult', slots, []);
    	let { suggestion } = $$props;

    	function handleOnSubmit() {
    		set_store_value(SearchTerm, $SearchTerm = suggestion, $SearchTerm);
    	}

    	const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;
    	const queryResult = useQuery('posts', () => fetch(`${url}?per_page=3&orderby=rand`).then(res => res.json()));
    	const writable_props = ['suggestion'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NoResult> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('suggestion' in $$props) $$invalidate(0, suggestion = $$props.suggestion);
    	};

    	$$self.$capture_state = () => ({
    		useQuery,
    		SearchTerm,
    		suggestion,
    		handleOnSubmit,
    		url,
    		queryResult,
    		$SearchTerm
    	});

    	$$self.$inject_state = $$props => {
    		if ('suggestion' in $$props) $$invalidate(0, suggestion = $$props.suggestion);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [suggestion, handleOnSubmit];
    }

    class NoResult extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$p, create_fragment$p, safe_not_equal, { suggestion: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NoResult",
    			options,
    			id: create_fragment$p.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*suggestion*/ ctx[0] === undefined && !('suggestion' in props)) {
    			console.warn("<NoResult> was created without expected prop 'suggestion'");
    		}
    	}

    	get suggestion() {
    		throw new Error("<NoResult>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suggestion(value) {
    		throw new Error("<NoResult>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-skeleton\Skeleton.svelte generated by Svelte v3.47.0 */

    const file$o = "node_modules\\svelte-skeleton\\Skeleton.svelte";

    // (23:9)      
    function fallback_block$1(ctx) {
    	let rect;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "width", /*width*/ ctx[3]);
    			attr_dev(rect, "height", /*height*/ ctx[2]);
    			attr_dev(rect, "x", "0");
    			attr_dev(rect, "y", "0");
    			attr_dev(rect, "rx", "8");
    			attr_dev(rect, "ry", "8");
    			add_location(rect, file$o, 23, 4, 675);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*width*/ 8) {
    				attr_dev(rect, "width", /*width*/ ctx[3]);
    			}

    			if (dirty & /*height*/ 4) {
    				attr_dev(rect, "height", /*height*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(23:9)      ",
    		ctx
    	});

    	return block;
    }

    // (34:3) {#if animate}
    function create_if_block$d(ctx) {
    	let animate0;
    	let animate0_from_value;
    	let animate0_dur_value;
    	let animate1;
    	let animate1_to_value;
    	let animate1_dur_value;

    	const block = {
    		c: function create() {
    			animate0 = svg_element("animate");
    			animate1 = svg_element("animate");
    			attr_dev(animate0, "attributeName", "x1");
    			attr_dev(animate0, "from", animate0_from_value = "-" + /*secondaryColorPercentWidth*/ ctx[6] + "%");
    			attr_dev(animate0, "to", "100%");
    			attr_dev(animate0, "dur", animate0_dur_value = "" + (/*speed*/ ctx[4] + "s"));
    			attr_dev(animate0, "repeatCount", "indefinite");
    			add_location(animate0, file$o, 34, 4, 888);
    			attr_dev(animate1, "attributeName", "x2");
    			attr_dev(animate1, "from", "0%");
    			attr_dev(animate1, "to", animate1_to_value = "" + (100 + /*secondaryColorPercentWidth*/ ctx[6] + "%"));
    			attr_dev(animate1, "dur", animate1_dur_value = "" + (/*speed*/ ctx[4] + "s"));
    			attr_dev(animate1, "repeatCount", "indefinite");
    			add_location(animate1, file$o, 41, 4, 1040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, animate0, anchor);
    			insert_dev(target, animate1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*secondaryColorPercentWidth*/ 64 && animate0_from_value !== (animate0_from_value = "-" + /*secondaryColorPercentWidth*/ ctx[6] + "%")) {
    				attr_dev(animate0, "from", animate0_from_value);
    			}

    			if (dirty & /*speed*/ 16 && animate0_dur_value !== (animate0_dur_value = "" + (/*speed*/ ctx[4] + "s"))) {
    				attr_dev(animate0, "dur", animate0_dur_value);
    			}

    			if (dirty & /*secondaryColorPercentWidth*/ 64 && animate1_to_value !== (animate1_to_value = "" + (100 + /*secondaryColorPercentWidth*/ ctx[6] + "%"))) {
    				attr_dev(animate1, "to", animate1_to_value);
    			}

    			if (dirty & /*speed*/ 16 && animate1_dur_value !== (animate1_dur_value = "" + (/*speed*/ ctx[4] + "s"))) {
    				attr_dev(animate1, "dur", animate1_dur_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(animate0);
    			if (detaching) detach_dev(animate1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(34:3) {#if animate}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let svg;
    	let rect;
    	let defs;
    	let clipPath;
    	let linearGradient;
    	let stop0;
    	let stop1;
    	let stop2;
    	let linearGradient_x__value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);
    	let if_block = /*animate*/ ctx[5] && create_if_block$d(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			rect = svg_element("rect");
    			defs = svg_element("defs");
    			clipPath = svg_element("clipPath");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			linearGradient = svg_element("linearGradient");
    			if (if_block) if_block.c();
    			stop0 = svg_element("stop");
    			stop1 = svg_element("stop");
    			stop2 = svg_element("stop");
    			attr_dev(rect, "fill", "url(#" + /*idGradient*/ ctx[9] + ")");
    			attr_dev(rect, "clip-path", "url(#" + /*idClip*/ ctx[8] + ")");
    			attr_dev(rect, "width", /*width*/ ctx[3]);
    			attr_dev(rect, "height", /*height*/ ctx[2]);
    			attr_dev(rect, "x", "0");
    			attr_dev(rect, "y", "0");
    			add_location(rect, file$o, 19, 1, 537);
    			attr_dev(clipPath, "id", /*idClip*/ ctx[8]);
    			add_location(clipPath, file$o, 21, 2, 638);
    			attr_dev(stop0, "stop-color", /*primaryColor*/ ctx[1]);
    			attr_dev(stop0, "offset", "0%");
    			add_location(stop0, file$o, 50, 3, 1204);
    			attr_dev(stop1, "stop-color", /*secondaryColor*/ ctx[0]);
    			attr_dev(stop1, "offset", "50%");
    			add_location(stop1, file$o, 51, 3, 1254);
    			attr_dev(stop2, "stop-color", /*primaryColor*/ ctx[1]);
    			attr_dev(stop2, "offset", "100%");
    			add_location(stop2, file$o, 52, 3, 1307);
    			attr_dev(linearGradient, "id", /*idGradient*/ ctx[9]);
    			attr_dev(linearGradient, "x1", linearGradient_x__value = "-" + /*secondaryColorPercentWidth*/ ctx[6] + "%");
    			attr_dev(linearGradient, "y1", "50%");
    			attr_dev(linearGradient, "x2", "0%");
    			attr_dev(linearGradient, "y2", "50%");
    			add_location(linearGradient, file$o, 26, 2, 754);
    			add_location(defs, file$o, 20, 1, 629);
    			attr_dev(svg, "width", /*width*/ ctx[3]);
    			attr_dev(svg, "height", /*height*/ ctx[2]);
    			attr_dev(svg, "aria-label", /*ariaLabel*/ ctx[7]);
    			attr_dev(svg, "preserveAspectRatio", "none");
    			add_location(svg, file$o, 18, 0, 463);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, rect);
    			append_dev(svg, defs);
    			append_dev(defs, clipPath);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(clipPath, null);
    			}

    			append_dev(defs, linearGradient);
    			if (if_block) if_block.m(linearGradient, null);
    			append_dev(linearGradient, stop0);
    			append_dev(linearGradient, stop1);
    			append_dev(linearGradient, stop2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*width*/ 8) {
    				attr_dev(rect, "width", /*width*/ ctx[3]);
    			}

    			if (!current || dirty & /*height*/ 4) {
    				attr_dev(rect, "height", /*height*/ ctx[2]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*width, height*/ 12)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (/*animate*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$d(ctx);
    					if_block.c();
    					if_block.m(linearGradient, stop0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*primaryColor*/ 2) {
    				attr_dev(stop0, "stop-color", /*primaryColor*/ ctx[1]);
    			}

    			if (!current || dirty & /*secondaryColor*/ 1) {
    				attr_dev(stop1, "stop-color", /*secondaryColor*/ ctx[0]);
    			}

    			if (!current || dirty & /*primaryColor*/ 2) {
    				attr_dev(stop2, "stop-color", /*primaryColor*/ ctx[1]);
    			}

    			if (!current || dirty & /*secondaryColorPercentWidth*/ 64 && linearGradient_x__value !== (linearGradient_x__value = "-" + /*secondaryColorPercentWidth*/ ctx[6] + "%")) {
    				attr_dev(linearGradient, "x1", linearGradient_x__value);
    			}

    			if (!current || dirty & /*width*/ 8) {
    				attr_dev(svg, "width", /*width*/ ctx[3]);
    			}

    			if (!current || dirty & /*height*/ 4) {
    				attr_dev(svg, "height", /*height*/ ctx[2]);
    			}

    			if (!current || dirty & /*ariaLabel*/ 128) {
    				attr_dev(svg, "aria-label", /*ariaLabel*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getUniqueId() {
    	return Math.random().toString(36).substring(2);
    }

    function instance$o($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skeleton', slots, ['default']);
    	let { secondaryColor = '#F5F5F7' } = $$props; // do not use rgba() - not working in Safari on iOS 11
    	let { primaryColor = '#EBECEF' } = $$props;
    	let { height = 200 } = $$props;
    	let { width = 400 } = $$props;
    	let { speed = 2 } = $$props;
    	let { animate = true } = $$props;
    	let { secondaryColorPercentWidth = 100 } = $$props;
    	let { ariaLabel = null } = $$props;
    	let idClip = getUniqueId();
    	let idGradient = getUniqueId();

    	const writable_props = [
    		'secondaryColor',
    		'primaryColor',
    		'height',
    		'width',
    		'speed',
    		'animate',
    		'secondaryColorPercentWidth',
    		'ariaLabel'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skeleton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('secondaryColor' in $$props) $$invalidate(0, secondaryColor = $$props.secondaryColor);
    		if ('primaryColor' in $$props) $$invalidate(1, primaryColor = $$props.primaryColor);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('speed' in $$props) $$invalidate(4, speed = $$props.speed);
    		if ('animate' in $$props) $$invalidate(5, animate = $$props.animate);
    		if ('secondaryColorPercentWidth' in $$props) $$invalidate(6, secondaryColorPercentWidth = $$props.secondaryColorPercentWidth);
    		if ('ariaLabel' in $$props) $$invalidate(7, ariaLabel = $$props.ariaLabel);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		secondaryColor,
    		primaryColor,
    		height,
    		width,
    		speed,
    		animate,
    		secondaryColorPercentWidth,
    		ariaLabel,
    		idClip,
    		idGradient,
    		getUniqueId
    	});

    	$$self.$inject_state = $$props => {
    		if ('secondaryColor' in $$props) $$invalidate(0, secondaryColor = $$props.secondaryColor);
    		if ('primaryColor' in $$props) $$invalidate(1, primaryColor = $$props.primaryColor);
    		if ('height' in $$props) $$invalidate(2, height = $$props.height);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('speed' in $$props) $$invalidate(4, speed = $$props.speed);
    		if ('animate' in $$props) $$invalidate(5, animate = $$props.animate);
    		if ('secondaryColorPercentWidth' in $$props) $$invalidate(6, secondaryColorPercentWidth = $$props.secondaryColorPercentWidth);
    		if ('ariaLabel' in $$props) $$invalidate(7, ariaLabel = $$props.ariaLabel);
    		if ('idClip' in $$props) $$invalidate(8, idClip = $$props.idClip);
    		if ('idGradient' in $$props) $$invalidate(9, idGradient = $$props.idGradient);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		secondaryColor,
    		primaryColor,
    		height,
    		width,
    		speed,
    		animate,
    		secondaryColorPercentWidth,
    		ariaLabel,
    		idClip,
    		idGradient,
    		$$scope,
    		slots
    	];
    }

    class Skeleton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$o, create_fragment$o, safe_not_equal, {
    			secondaryColor: 0,
    			primaryColor: 1,
    			height: 2,
    			width: 3,
    			speed: 4,
    			animate: 5,
    			secondaryColorPercentWidth: 6,
    			ariaLabel: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skeleton",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get secondaryColor() {
    		throw new Error("<Skeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryColor(value) {
    		throw new Error("<Skeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryColor() {
    		throw new Error("<Skeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryColor(value) {
    		throw new Error("<Skeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Skeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Skeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Skeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Skeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get speed() {
    		throw new Error("<Skeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set speed(value) {
    		throw new Error("<Skeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animate() {
    		throw new Error("<Skeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animate(value) {
    		throw new Error("<Skeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryColorPercentWidth() {
    		throw new Error("<Skeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryColorPercentWidth(value) {
    		throw new Error("<Skeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Skeleton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Skeleton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\ViewResultLoading.svelte generated by Svelte v3.47.0 */
    const file$n = "src\\components\\ViewResultLoading.svelte";

    function create_fragment$n(ctx) {
    	let div31;
    	let div1;
    	let div0;
    	let t1;
    	let div30;
    	let div29;
    	let article;
    	let section;
    	let div2;
    	let skeleton0;
    	let t2;
    	let div3;
    	let header;
    	let h1;
    	let skeleton1;
    	let t3;
    	let skeleton2;
    	let t4;
    	let skeleton3;
    	let t5;
    	let footer;
    	let skeleton4;
    	let t6;
    	let div4;
    	let skeleton5;
    	let t7;
    	let skeleton6;
    	let t8;
    	let skeleton7;
    	let t9;
    	let skeleton8;
    	let t10;
    	let div28;
    	let div27;
    	let div7;
    	let span0;
    	let t11;
    	let div5;
    	let t13;
    	let div6;
    	let skeleton9;
    	let t14;
    	let div10;
    	let span1;
    	let t15;
    	let div8;
    	let t17;
    	let div9;
    	let skeleton10;
    	let t18;
    	let div13;
    	let span2;
    	let t19;
    	let div11;
    	let t21;
    	let div12;
    	let skeleton11;
    	let t22;
    	let div17;
    	let span3;
    	let t23;
    	let div14;
    	let t25;
    	let div16;
    	let div15;
    	let skeleton12;
    	let t26;
    	let div20;
    	let span4;
    	let t27;
    	let div18;
    	let t29;
    	let div19;
    	let skeleton13;
    	let t30;
    	let div23;
    	let span5;
    	let t31;
    	let div21;
    	let t33;
    	let div22;
    	let skeleton14;
    	let t34;
    	let div26;
    	let span6;
    	let t35;
    	let div24;
    	let t37;
    	let div25;
    	let skeleton15;
    	let current;

    	skeleton0 = new Skeleton({
    			props: {
    				height: "240",
    				width: "400",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton1 = new Skeleton({
    			props: {
    				height: "35",
    				width: "400",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton2 = new Skeleton({
    			props: {
    				height: "35",
    				width: "395",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton3 = new Skeleton({
    			props: {
    				height: "35",
    				width: "340",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton4 = new Skeleton({
    			props: {
    				height: "57",
    				width: "200",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton5 = new Skeleton({
    			props: {
    				height: "180",
    				width: "300",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton6 = new Skeleton({
    			props: {
    				height: "180",
    				width: "300",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton7 = new Skeleton({
    			props: {
    				height: "180",
    				width: "300",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton8 = new Skeleton({
    			props: {
    				height: "180",
    				width: "300",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton9 = new Skeleton({
    			props: {
    				height: "25",
    				width: "100",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton10 = new Skeleton({
    			props: {
    				height: "25",
    				width: "70",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton11 = new Skeleton({
    			props: {
    				height: "25",
    				width: "80",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton12 = new Skeleton({
    			props: {
    				height: "25",
    				width: "90",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton13 = new Skeleton({
    			props: {
    				height: "25",
    				width: "80",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton14 = new Skeleton({
    			props: {
    				height: "50",
    				width: "90",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	skeleton15 = new Skeleton({
    			props: {
    				height: "70",
    				width: "100",
    				secondaryColor: "#f5f4f4"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div31 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "client success story";
    			t1 = space();
    			div30 = element("div");
    			div29 = element("div");
    			article = element("article");
    			section = element("section");
    			div2 = element("div");
    			create_component(skeleton0.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			header = element("header");
    			h1 = element("h1");
    			create_component(skeleton1.$$.fragment);
    			t3 = space();
    			create_component(skeleton2.$$.fragment);
    			t4 = space();
    			create_component(skeleton3.$$.fragment);
    			t5 = space();
    			footer = element("footer");
    			create_component(skeleton4.$$.fragment);
    			t6 = space();
    			div4 = element("div");
    			create_component(skeleton5.$$.fragment);
    			t7 = space();
    			create_component(skeleton6.$$.fragment);
    			t8 = space();
    			create_component(skeleton7.$$.fragment);
    			t9 = space();
    			create_component(skeleton8.$$.fragment);
    			t10 = space();
    			div28 = element("div");
    			div27 = element("div");
    			div7 = element("div");
    			span0 = element("span");
    			t11 = space();
    			div5 = element("div");
    			div5.textContent = "Industry";
    			t13 = space();
    			div6 = element("div");
    			create_component(skeleton9.$$.fragment);
    			t14 = space();
    			div10 = element("div");
    			span1 = element("span");
    			t15 = space();
    			div8 = element("div");
    			div8.textContent = "Location";
    			t17 = space();
    			div9 = element("div");
    			create_component(skeleton10.$$.fragment);
    			t18 = space();
    			div13 = element("div");
    			span2 = element("span");
    			t19 = space();
    			div11 = element("div");
    			div11.textContent = "Headquarters";
    			t21 = space();
    			div12 = element("div");
    			create_component(skeleton11.$$.fragment);
    			t22 = space();
    			div17 = element("div");
    			span3 = element("span");
    			t23 = space();
    			div14 = element("div");
    			div14.textContent = "Campaign Type";
    			t25 = space();
    			div16 = element("div");
    			div15 = element("div");
    			create_component(skeleton12.$$.fragment);
    			t26 = space();
    			div20 = element("div");
    			span4 = element("span");
    			t27 = space();
    			div18 = element("div");
    			div18.textContent = "Target Location";
    			t29 = space();
    			div19 = element("div");
    			create_component(skeleton13.$$.fragment);
    			t30 = space();
    			div23 = element("div");
    			span5 = element("span");
    			t31 = space();
    			div21 = element("div");
    			div21.textContent = "Target Industries";
    			t33 = space();
    			div22 = element("div");
    			create_component(skeleton14.$$.fragment);
    			t34 = space();
    			div26 = element("div");
    			span6 = element("span");
    			t35 = space();
    			div24 = element("div");
    			div24.textContent = "Target Contacts";
    			t37 = space();
    			div25 = element("div");
    			create_component(skeleton15.$$.fragment);
    			attr_dev(div0, "class", "client-success-story svelte-rohqd8");
    			add_location(div0, file$n, 6, 4, 148);
    			attr_dev(div1, "class", "cs-hero svelte-rohqd8");
    			add_location(div1, file$n, 5, 2, 121);
    			add_location(div2, file$n, 12, 10, 359);
    			attr_dev(h1, "class", "cs-title svelte-rohqd8");
    			add_location(h1, file$n, 17, 14, 533);
    			add_location(header, file$n, 16, 12, 509);
    			add_location(footer, file$n, 23, 12, 849);
    			attr_dev(div3, "class", "entry-outer svelte-rohqd8");
    			add_location(div3, file$n, 15, 10, 470);
    			attr_dev(section, "class", "cs-entry svelte-rohqd8");
    			add_location(section, file$n, 11, 8, 321);
    			attr_dev(div4, "class", "cs-results svelte-rohqd8");
    			add_location(div4, file$n, 28, 8, 1005);
    			attr_dev(span0, "class", "fa fa-briefcase");
    			add_location(span0, file$n, 37, 14, 1445);
    			attr_dev(div5, "class", "cs-specs-label");
    			add_location(div5, file$n, 38, 14, 1493);
    			attr_dev(div6, "class", "cs-specs-post");
    			add_location(div6, file$n, 39, 14, 1551);
    			add_location(div7, file$n, 36, 12, 1424);
    			attr_dev(span1, "class", "fa fa-map-marker-alt");
    			add_location(span1, file$n, 44, 14, 1734);
    			attr_dev(div8, "class", "cs-specs-label");
    			add_location(div8, file$n, 45, 14, 1787);
    			attr_dev(div9, "class", "cs-specs-post");
    			add_location(div9, file$n, 46, 14, 1845);
    			add_location(div10, file$n, 43, 12, 1713);
    			attr_dev(span2, "class", "fa fa-building");
    			add_location(span2, file$n, 51, 14, 2027);
    			attr_dev(div11, "class", "cs-specs-label");
    			add_location(div11, file$n, 52, 14, 2074);
    			attr_dev(div12, "class", "cs-specs-post");
    			add_location(div12, file$n, 53, 14, 2136);
    			add_location(div13, file$n, 50, 12, 2006);
    			attr_dev(span3, "class", "fa fa-chart-line");
    			add_location(span3, file$n, 58, 14, 2318);
    			attr_dev(div14, "class", "cs-specs-label");
    			add_location(div14, file$n, 59, 14, 2367);
    			attr_dev(div15, "class", "cs-specs-post");
    			add_location(div15, file$n, 62, 16, 2455);
    			add_location(div16, file$n, 61, 14, 2432);
    			add_location(div17, file$n, 57, 12, 2297);
    			attr_dev(span4, "class", "fa fa-map-marker-alt");
    			add_location(span4, file$n, 68, 14, 2663);
    			attr_dev(div18, "class", "cs-specs-label");
    			add_location(div18, file$n, 69, 14, 2716);
    			attr_dev(div19, "class", "cs-specs-post");
    			add_location(div19, file$n, 70, 14, 2781);
    			add_location(div20, file$n, 67, 12, 2642);
    			attr_dev(span5, "class", "fa fa-briefcase");
    			add_location(span5, file$n, 75, 14, 2963);
    			attr_dev(div21, "class", "cs-specs-label");
    			add_location(div21, file$n, 76, 14, 3011);
    			attr_dev(div22, "class", "cs-specs-post");
    			add_location(div22, file$n, 77, 14, 3078);
    			add_location(div23, file$n, 74, 12, 2942);
    			attr_dev(span6, "class", "fa fa-user");
    			add_location(span6, file$n, 82, 14, 3260);
    			attr_dev(div24, "class", "cs-specs-label");
    			add_location(div24, file$n, 83, 14, 3303);
    			attr_dev(div25, "class", "cs-specs-post");
    			add_location(div25, file$n, 84, 14, 3368);
    			add_location(div26, file$n, 81, 12, 3239);
    			attr_dev(div27, "class", "cs-specs svelte-rohqd8");
    			add_location(div27, file$n, 35, 10, 1388);
    			attr_dev(div28, "class", "cs-campaign");
    			add_location(div28, file$n, 34, 8, 1351);
    			attr_dev(article, "class", "post svelte-rohqd8");
    			add_location(article, file$n, 10, 6, 289);
    			attr_dev(div29, "class", "case-study-outer svelte-rohqd8");
    			add_location(div29, file$n, 9, 4, 251);
    			attr_dev(div30, "class", "container svelte-rohqd8");
    			add_location(div30, file$n, 8, 2, 222);
    			attr_dev(div31, "class", "results svelte-fhxlyi");
    			add_location(div31, file$n, 4, 0, 82);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div31, anchor);
    			append_dev(div31, div1);
    			append_dev(div1, div0);
    			append_dev(div31, t1);
    			append_dev(div31, div30);
    			append_dev(div30, div29);
    			append_dev(div29, article);
    			append_dev(article, section);
    			append_dev(section, div2);
    			mount_component(skeleton0, div2, null);
    			append_dev(section, t2);
    			append_dev(section, div3);
    			append_dev(div3, header);
    			append_dev(header, h1);
    			mount_component(skeleton1, h1, null);
    			append_dev(h1, t3);
    			mount_component(skeleton2, h1, null);
    			append_dev(h1, t4);
    			mount_component(skeleton3, h1, null);
    			append_dev(div3, t5);
    			append_dev(div3, footer);
    			mount_component(skeleton4, footer, null);
    			append_dev(article, t6);
    			append_dev(article, div4);
    			mount_component(skeleton5, div4, null);
    			append_dev(div4, t7);
    			mount_component(skeleton6, div4, null);
    			append_dev(div4, t8);
    			mount_component(skeleton7, div4, null);
    			append_dev(div4, t9);
    			mount_component(skeleton8, div4, null);
    			append_dev(article, t10);
    			append_dev(article, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div7);
    			append_dev(div7, span0);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			mount_component(skeleton9, div6, null);
    			append_dev(div27, t14);
    			append_dev(div27, div10);
    			append_dev(div10, span1);
    			append_dev(div10, t15);
    			append_dev(div10, div8);
    			append_dev(div10, t17);
    			append_dev(div10, div9);
    			mount_component(skeleton10, div9, null);
    			append_dev(div27, t18);
    			append_dev(div27, div13);
    			append_dev(div13, span2);
    			append_dev(div13, t19);
    			append_dev(div13, div11);
    			append_dev(div13, t21);
    			append_dev(div13, div12);
    			mount_component(skeleton11, div12, null);
    			append_dev(div27, t22);
    			append_dev(div27, div17);
    			append_dev(div17, span3);
    			append_dev(div17, t23);
    			append_dev(div17, div14);
    			append_dev(div17, t25);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			mount_component(skeleton12, div15, null);
    			append_dev(div27, t26);
    			append_dev(div27, div20);
    			append_dev(div20, span4);
    			append_dev(div20, t27);
    			append_dev(div20, div18);
    			append_dev(div20, t29);
    			append_dev(div20, div19);
    			mount_component(skeleton13, div19, null);
    			append_dev(div27, t30);
    			append_dev(div27, div23);
    			append_dev(div23, span5);
    			append_dev(div23, t31);
    			append_dev(div23, div21);
    			append_dev(div23, t33);
    			append_dev(div23, div22);
    			mount_component(skeleton14, div22, null);
    			append_dev(div27, t34);
    			append_dev(div27, div26);
    			append_dev(div26, span6);
    			append_dev(div26, t35);
    			append_dev(div26, div24);
    			append_dev(div26, t37);
    			append_dev(div26, div25);
    			mount_component(skeleton15, div25, null);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skeleton0.$$.fragment, local);
    			transition_in(skeleton1.$$.fragment, local);
    			transition_in(skeleton2.$$.fragment, local);
    			transition_in(skeleton3.$$.fragment, local);
    			transition_in(skeleton4.$$.fragment, local);
    			transition_in(skeleton5.$$.fragment, local);
    			transition_in(skeleton6.$$.fragment, local);
    			transition_in(skeleton7.$$.fragment, local);
    			transition_in(skeleton8.$$.fragment, local);
    			transition_in(skeleton9.$$.fragment, local);
    			transition_in(skeleton10.$$.fragment, local);
    			transition_in(skeleton11.$$.fragment, local);
    			transition_in(skeleton12.$$.fragment, local);
    			transition_in(skeleton13.$$.fragment, local);
    			transition_in(skeleton14.$$.fragment, local);
    			transition_in(skeleton15.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skeleton0.$$.fragment, local);
    			transition_out(skeleton1.$$.fragment, local);
    			transition_out(skeleton2.$$.fragment, local);
    			transition_out(skeleton3.$$.fragment, local);
    			transition_out(skeleton4.$$.fragment, local);
    			transition_out(skeleton5.$$.fragment, local);
    			transition_out(skeleton6.$$.fragment, local);
    			transition_out(skeleton7.$$.fragment, local);
    			transition_out(skeleton8.$$.fragment, local);
    			transition_out(skeleton9.$$.fragment, local);
    			transition_out(skeleton10.$$.fragment, local);
    			transition_out(skeleton11.$$.fragment, local);
    			transition_out(skeleton12.$$.fragment, local);
    			transition_out(skeleton13.$$.fragment, local);
    			transition_out(skeleton14.$$.fragment, local);
    			transition_out(skeleton15.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div31);
    			destroy_component(skeleton0);
    			destroy_component(skeleton1);
    			destroy_component(skeleton2);
    			destroy_component(skeleton3);
    			destroy_component(skeleton4);
    			destroy_component(skeleton5);
    			destroy_component(skeleton6);
    			destroy_component(skeleton7);
    			destroy_component(skeleton8);
    			destroy_component(skeleton9);
    			destroy_component(skeleton10);
    			destroy_component(skeleton11);
    			destroy_component(skeleton12);
    			destroy_component(skeleton13);
    			destroy_component(skeleton14);
    			destroy_component(skeleton15);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ViewResultLoading', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ViewResultLoading> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Skeleton });
    	return [];
    }

    class ViewResultLoading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ViewResultLoading",
    			options,
    			id: create_fragment$n.name
    		});
    	}
    }

    /* src\components\ViewResult.svelte generated by Svelte v3.47.0 */
    const file$m = "src\\components\\ViewResult.svelte";

    function get_each_context$a(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i].posts;
    	child_ctx[13] = list[i].id;
    	return child_ctx;
    }

    function get_each_context_1$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    // (57:8) {:else}
    function create_else_block$8(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value = /*data*/ ctx[9];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[13];
    	validate_each_keys(ctx, each_value, get_each_context$a, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$a(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$a(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, $fieldID*/ 514) {
    				each_value = /*data*/ ctx[9];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$a, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block$a, each_1_anchor, get_each_context$a);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(57:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:26) 
    function create_if_block_1$c(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Error";
    			add_location(span, file$m, 55, 10, 1558);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$c.name,
    		type: "if",
    		source: "(55:26) ",
    		ctx
    	});

    	return block;
    }

    // (53:8) {#if isFetching}
    function create_if_block$c(ctx) {
    	let viewresultloading;
    	let current;
    	viewresultloading = new ViewResultLoading({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(viewresultloading.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(viewresultloading, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(viewresultloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(viewresultloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(viewresultloading, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(53:8) {#if isFetching}",
    		ctx
    	});

    	return block;
    }

    // (60:14) {#if post.id == $fieldID}
    function create_if_block_2$b(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let div30;
    	let div29;
    	let article;
    	let section;
    	let div2;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t2;
    	let div3;
    	let header;
    	let h1;
    	let t3_value = /*post*/ ctx[16].title + "";
    	let t3;
    	let t4;
    	let footer;
    	let t5;
    	let div4;
    	let t6;
    	let div28;
    	let div25;
    	let div7;
    	let span0;
    	let t7;
    	let div5;
    	let t9;
    	let div6;
    	let t10_value = /*post*/ ctx[16].product + "";
    	let t10;
    	let t11;
    	let div10;
    	let span1;
    	let t12;
    	let div8;
    	let t14;
    	let div9;
    	let t15_value = /*post*/ ctx[16].clientLocation + "";
    	let t15;
    	let t16;
    	let div13;
    	let span2;
    	let t17;
    	let div11;
    	let t19;
    	let div12;
    	let t20_value = /*post*/ ctx[16].clientHQ + "";
    	let t20;
    	let t21;
    	let div15;
    	let span3;
    	let t22;
    	let div14;
    	let t24;
    	let t25;
    	let div18;
    	let span4;
    	let t26;
    	let div16;
    	let t28;
    	let div17;
    	let t29_value = /*post*/ ctx[16].targetLocation + "";
    	let t29;
    	let t30;
    	let div21;
    	let span5;
    	let t31;
    	let div19;
    	let t33;
    	let div20;
    	let t34_value = /*post*/ ctx[16].targetIndustry + "";
    	let t34;
    	let t35;
    	let div24;
    	let span6;
    	let t36;
    	let div22;
    	let t38;
    	let div23;
    	let t39_value = /*post*/ ctx[16].targetDM + "";
    	let t39;
    	let t40;
    	let div27;
    	let div26;
    	let h20;
    	let t42;
    	let p0;
    	let t44;
    	let p1;
    	let strong;
    	let br0;
    	let t46;
    	let br1;
    	let t47;
    	let t48;
    	let h21;
    	let t50;
    	let p2;
    	let t52;
    	let p3;
    	let t54;
    	let each_value_3 = /*post*/ ctx[16].results;
    	validate_each_argument(each_value_3);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_1[i] = create_each_block_3$3(get_each_context_3$3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*post*/ ctx[16].campaign;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$3(get_each_context_2$3(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "client success story";
    			t1 = space();
    			div30 = element("div");
    			div29 = element("div");
    			article = element("article");
    			section = element("section");
    			div2 = element("div");
    			img = element("img");
    			t2 = space();
    			div3 = element("div");
    			header = element("header");
    			h1 = element("h1");
    			t3 = text(t3_value);
    			t4 = space();
    			footer = element("footer");
    			t5 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t6 = space();
    			div28 = element("div");
    			div25 = element("div");
    			div7 = element("div");
    			span0 = element("span");
    			t7 = space();
    			div5 = element("div");
    			div5.textContent = "Industry";
    			t9 = space();
    			div6 = element("div");
    			t10 = text(t10_value);
    			t11 = space();
    			div10 = element("div");
    			span1 = element("span");
    			t12 = space();
    			div8 = element("div");
    			div8.textContent = "Location";
    			t14 = space();
    			div9 = element("div");
    			t15 = text(t15_value);
    			t16 = space();
    			div13 = element("div");
    			span2 = element("span");
    			t17 = space();
    			div11 = element("div");
    			div11.textContent = "Headquarters";
    			t19 = space();
    			div12 = element("div");
    			t20 = text(t20_value);
    			t21 = space();
    			div15 = element("div");
    			span3 = element("span");
    			t22 = space();
    			div14 = element("div");
    			div14.textContent = "Campaign Type";
    			t24 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t25 = space();
    			div18 = element("div");
    			span4 = element("span");
    			t26 = space();
    			div16 = element("div");
    			div16.textContent = "Target Location";
    			t28 = space();
    			div17 = element("div");
    			t29 = text(t29_value);
    			t30 = space();
    			div21 = element("div");
    			span5 = element("span");
    			t31 = space();
    			div19 = element("div");
    			div19.textContent = "Target Industries";
    			t33 = space();
    			div20 = element("div");
    			t34 = text(t34_value);
    			t35 = space();
    			div24 = element("div");
    			span6 = element("span");
    			t36 = space();
    			div22 = element("div");
    			div22.textContent = "Target Contacts";
    			t38 = space();
    			div23 = element("div");
    			t39 = text(t39_value);
    			t40 = space();
    			div27 = element("div");
    			div26 = element("div");
    			h20 = element("h2");
    			h20.textContent = "The Client";
    			t42 = space();
    			p0 = element("p");
    			p0.textContent = "The Client is a global leader in insurance\r\n                              technology, serving hundreds of carriers and\r\n                              agents, brokers, and other industry players in\r\n                              more than 30 countries.";
    			t44 = space();
    			p1 = element("p");
    			strong = element("strong");
    			strong.textContent = "Lines of Business";
    			br0 = element("br");
    			t46 = text(" PaaS\r\n                              (Platform as a Service)");
    			br1 = element("br");
    			t47 = text(" SaaS (Software as a Service)");
    			t48 = space();
    			h21 = element("h2");
    			h21.textContent = "The Challenge";
    			t50 = space();
    			p2 = element("p");
    			p2.textContent = "The Client has been dedicated to insurtech\r\n                              innovation since its founding in 2000, and\r\n                              consecutively developed insurance platforms in the\r\n                              succeeding years: the world’s first browser/server\r\n                              based insurance core system suite, leading the\r\n                              advent and adoption of Java-based 3G insurance IT,\r\n                              and a cloud-native and microservices-based 4G\r\n                              insurance platform that provides a complete set of\r\n                              insurance APIs across an insurance policy’s full\r\n                              lifecycle.";
    			t52 = space();
    			p3 = element("p");
    			p3.textContent = "In this campaign, the Client wanted to address the\r\n                              challenges that the property casualty insurance\r\n                              market is facing through its cloud-based solution\r\n                              that enables digital insurance and enterprise\r\n                              level core system insurance software.";
    			t54 = space();
    			attr_dev(div0, "class", "client-success-story svelte-r7zn02");
    			add_location(div0, file$m, 61, 18, 1774);
    			attr_dev(div1, "class", "cs-hero svelte-r7zn02");
    			add_location(div1, file$m, 60, 16, 1733);
    			if (!src_url_equal(img.src, img_src_value = /*post*/ ctx[16].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*post*/ ctx[16].title);
    			attr_dev(img, "loading", "lazy");
    			attr_dev(img, "width", "800px");
    			attr_dev(img, "height", "450px");
    			attr_dev(img, "sizes", "(max-width: 800px) 100vw, 800px");
    			attr_dev(img, "class", "svelte-r7zn02");
    			add_location(img, file$m, 68, 26, 2102);
    			add_location(div2, file$m, 67, 24, 2069);
    			attr_dev(h1, "class", "cs-title svelte-r7zn02");
    			add_location(h1, file$m, 79, 28, 2577);
    			add_location(header, file$m, 78, 26, 2539);
    			add_location(footer, file$m, 81, 26, 2680);
    			attr_dev(div3, "class", "entry-outer svelte-r7zn02");
    			add_location(div3, file$m, 77, 24, 2486);
    			attr_dev(section, "class", "cs-entry svelte-r7zn02");
    			add_location(section, file$m, 66, 22, 2017);
    			attr_dev(div4, "class", "cs-results svelte-r7zn02");
    			add_location(div4, file$m, 88, 22, 2970);
    			attr_dev(span0, "class", "fa fa-briefcase");
    			add_location(span0, file$m, 99, 28, 3516);
    			attr_dev(div5, "class", "cs-specs-label svelte-r7zn02");
    			add_location(div5, file$m, 100, 28, 3578);
    			attr_dev(div6, "class", "cs-specs-post svelte-r7zn02");
    			add_location(div6, file$m, 101, 28, 3650);
    			add_location(div7, file$m, 98, 26, 3481);
    			attr_dev(span1, "class", "fa fa-map-marker-alt");
    			add_location(span1, file$m, 104, 28, 3794);
    			attr_dev(div8, "class", "cs-specs-label svelte-r7zn02");
    			add_location(div8, file$m, 105, 28, 3861);
    			attr_dev(div9, "class", "cs-specs-post svelte-r7zn02");
    			add_location(div9, file$m, 106, 28, 3933);
    			add_location(div10, file$m, 103, 26, 3759);
    			attr_dev(span2, "class", "fa fa-building");
    			add_location(span2, file$m, 111, 28, 4146);
    			attr_dev(div11, "class", "cs-specs-label svelte-r7zn02");
    			add_location(div11, file$m, 112, 28, 4207);
    			attr_dev(div12, "class", "cs-specs-post svelte-r7zn02");
    			add_location(div12, file$m, 113, 28, 4283);
    			add_location(div13, file$m, 110, 26, 4111);
    			attr_dev(span3, "class", "fa fa-chart-line");
    			add_location(span3, file$m, 116, 28, 4428);
    			attr_dev(div14, "class", "cs-specs-label svelte-r7zn02");
    			add_location(div14, file$m, 117, 28, 4491);
    			add_location(div15, file$m, 115, 26, 4393);
    			attr_dev(span4, "class", "fa fa-map-marker-alt");
    			add_location(span4, file$m, 127, 28, 4963);
    			attr_dev(div16, "class", "cs-specs-label svelte-r7zn02");
    			add_location(div16, file$m, 128, 28, 5030);
    			attr_dev(div17, "class", "cs-specs-post svelte-r7zn02");
    			add_location(div17, file$m, 129, 28, 5109);
    			add_location(div18, file$m, 126, 26, 4928);
    			attr_dev(span5, "class", "fa fa-briefcase");
    			add_location(span5, file$m, 134, 28, 5322);
    			attr_dev(div19, "class", "cs-specs-label svelte-r7zn02");
    			add_location(div19, file$m, 135, 28, 5384);
    			attr_dev(div20, "class", "cs-specs-post svelte-r7zn02");
    			add_location(div20, file$m, 136, 28, 5465);
    			add_location(div21, file$m, 133, 26, 5287);
    			attr_dev(span6, "class", "fa fa-user");
    			add_location(span6, file$m, 141, 28, 5678);
    			attr_dev(div22, "class", "cs-specs-label svelte-r7zn02");
    			add_location(div22, file$m, 142, 28, 5735);
    			attr_dev(div23, "class", "cs-specs-post svelte-r7zn02");
    			add_location(div23, file$m, 143, 28, 5814);
    			add_location(div24, file$m, 140, 26, 5643);
    			attr_dev(div25, "class", "cs-specs svelte-r7zn02");
    			add_location(div25, file$m, 97, 24, 3431);
    			attr_dev(h20, "class", "svelte-r7zn02");
    			add_location(h20, file$m, 150, 28, 6103);
    			add_location(p0, file$m, 151, 28, 6152);
    			add_location(strong, file$m, 158, 30, 6537);
    			add_location(br0, file$m, 158, 64, 6571);
    			add_location(br1, file$m, 159, 53, 6637);
    			add_location(p1, file$m, 157, 28, 6502);
    			attr_dev(h21, "class", "svelte-r7zn02");
    			add_location(h21, file$m, 161, 28, 6736);
    			add_location(p2, file$m, 162, 28, 6788);
    			add_location(p3, file$m, 174, 28, 7608);
    			add_location(div26, file$m, 149, 26, 6068);
    			attr_dev(div27, "class", "cs-content svelte-r7zn02");
    			add_location(div27, file$m, 148, 24, 6016);
    			attr_dev(div28, "class", "cs-campaign svelte-r7zn02");
    			add_location(div28, file$m, 96, 22, 3380);
    			attr_dev(article, "class", "post svelte-r7zn02");
    			add_location(article, file$m, 65, 20, 1971);
    			attr_dev(div29, "class", "case-study-outer svelte-r7zn02");
    			add_location(div29, file$m, 64, 18, 1919);
    			attr_dev(div30, "class", "container svelte-r7zn02");
    			add_location(div30, file$m, 63, 16, 1876);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div30, anchor);
    			append_dev(div30, div29);
    			append_dev(div29, article);
    			append_dev(article, section);
    			append_dev(section, div2);
    			append_dev(div2, img);
    			append_dev(section, t2);
    			append_dev(section, div3);
    			append_dev(div3, header);
    			append_dev(header, h1);
    			append_dev(h1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, footer);
    			append_dev(article, t5);
    			append_dev(article, div4);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div4, null);
    			}

    			append_dev(article, t6);
    			append_dev(article, div28);
    			append_dev(div28, div25);
    			append_dev(div25, div7);
    			append_dev(div7, span0);
    			append_dev(div7, t7);
    			append_dev(div7, div5);
    			append_dev(div7, t9);
    			append_dev(div7, div6);
    			append_dev(div6, t10);
    			append_dev(div25, t11);
    			append_dev(div25, div10);
    			append_dev(div10, span1);
    			append_dev(div10, t12);
    			append_dev(div10, div8);
    			append_dev(div10, t14);
    			append_dev(div10, div9);
    			append_dev(div9, t15);
    			append_dev(div25, t16);
    			append_dev(div25, div13);
    			append_dev(div13, span2);
    			append_dev(div13, t17);
    			append_dev(div13, div11);
    			append_dev(div13, t19);
    			append_dev(div13, div12);
    			append_dev(div12, t20);
    			append_dev(div25, t21);
    			append_dev(div25, div15);
    			append_dev(div15, span3);
    			append_dev(div15, t22);
    			append_dev(div15, div14);
    			append_dev(div15, t24);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div15, null);
    			}

    			append_dev(div25, t25);
    			append_dev(div25, div18);
    			append_dev(div18, span4);
    			append_dev(div18, t26);
    			append_dev(div18, div16);
    			append_dev(div18, t28);
    			append_dev(div18, div17);
    			append_dev(div17, t29);
    			append_dev(div25, t30);
    			append_dev(div25, div21);
    			append_dev(div21, span5);
    			append_dev(div21, t31);
    			append_dev(div21, div19);
    			append_dev(div21, t33);
    			append_dev(div21, div20);
    			append_dev(div20, t34);
    			append_dev(div25, t35);
    			append_dev(div25, div24);
    			append_dev(div24, span6);
    			append_dev(div24, t36);
    			append_dev(div24, div22);
    			append_dev(div24, t38);
    			append_dev(div24, div23);
    			append_dev(div23, t39);
    			append_dev(div28, t40);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div26, h20);
    			append_dev(div26, t42);
    			append_dev(div26, p0);
    			append_dev(div26, t44);
    			append_dev(div26, p1);
    			append_dev(p1, strong);
    			append_dev(p1, br0);
    			append_dev(p1, t46);
    			append_dev(p1, br1);
    			append_dev(p1, t47);
    			append_dev(div26, t48);
    			append_dev(div26, h21);
    			append_dev(div26, t50);
    			append_dev(div26, p2);
    			append_dev(div26, t52);
    			append_dev(div26, p3);
    			append_dev(div30, t54);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 512 && !src_url_equal(img.src, img_src_value = /*post*/ ctx[16].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*data*/ 512 && img_alt_value !== (img_alt_value = /*post*/ ctx[16].title)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*data*/ 512 && t3_value !== (t3_value = /*post*/ ctx[16].title + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*data*/ 512) {
    				each_value_3 = /*post*/ ctx[16].results;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$3(ctx, each_value_3, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_3$3(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_3.length;
    			}

    			if (dirty & /*data*/ 512 && t10_value !== (t10_value = /*post*/ ctx[16].product + "")) set_data_dev(t10, t10_value);
    			if (dirty & /*data*/ 512 && t15_value !== (t15_value = /*post*/ ctx[16].clientLocation + "")) set_data_dev(t15, t15_value);
    			if (dirty & /*data*/ 512 && t20_value !== (t20_value = /*post*/ ctx[16].clientHQ + "")) set_data_dev(t20, t20_value);

    			if (dirty & /*data*/ 512) {
    				each_value_2 = /*post*/ ctx[16].campaign;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$3(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div15, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}

    			if (dirty & /*data*/ 512 && t29_value !== (t29_value = /*post*/ ctx[16].targetLocation + "")) set_data_dev(t29, t29_value);
    			if (dirty & /*data*/ 512 && t34_value !== (t34_value = /*post*/ ctx[16].targetIndustry + "")) set_data_dev(t34, t34_value);
    			if (dirty & /*data*/ 512 && t39_value !== (t39_value = /*post*/ ctx[16].targetDM + "")) set_data_dev(t39, t39_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div30);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$b.name,
    		type: "if",
    		source: "(60:14) {#if post.id == $fieldID}",
    		ctx
    	});

    	return block;
    }

    // (90:24) {#each post.results as result}
    function create_each_block_3$3(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*result*/ ctx[22].value + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2_value = /*result*/ ctx[22].label + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(div0, "class", "cs-result-value svelte-r7zn02");
    			add_location(div0, file$m, 91, 28, 3131);
    			attr_dev(div1, "class", "cs-result-label svelte-r7zn02");
    			add_location(div1, file$m, 92, 28, 3210);
    			attr_dev(div2, "class", "cs-result svelte-r7zn02");
    			add_location(div2, file$m, 90, 26, 3078);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, t2);
    			append_dev(div2, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 512 && t0_value !== (t0_value = /*result*/ ctx[22].value + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*data*/ 512 && t2_value !== (t2_value = /*result*/ ctx[22].label + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$3.name,
    		type: "each",
    		source: "(90:24) {#each post.results as result}",
    		ctx
    	});

    	return block;
    }

    // (119:28) {#each post.campaign as campaign}
    function create_each_block_2$3(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*campaign*/ ctx[19].label + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div0, "class", "cs-specs-post svelte-r7zn02");
    			add_location(div0, file$m, 120, 32, 4672);
    			add_location(div1, file$m, 119, 30, 4633);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 512 && t0_value !== (t0_value = /*campaign*/ ctx[19].label + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$3.name,
    		type: "each",
    		source: "(119:28) {#each post.campaign as campaign}",
    		ctx
    	});

    	return block;
    }

    // (59:12) {#each posts as post}
    function create_each_block_1$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*post*/ ctx[16].id == /*$fieldID*/ ctx[1] && create_if_block_2$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*post*/ ctx[16].id == /*$fieldID*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$b(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$3.name,
    		type: "each",
    		source: "(59:12) {#each posts as post}",
    		ctx
    	});

    	return block;
    }

    // (58:10) {#each data as { posts, id }
    function create_each_block$a(key_1, ctx) {
    	let first;
    	let each_1_anchor;
    	let each_value_1 = /*posts*/ ctx[12];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*data, $fieldID*/ 514) {
    				each_value_1 = /*posts*/ ctx[12];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$a.name,
    		type: "each",
    		source: "(58:10) {#each data as { posts, id }",
    		ctx
    	});

    	return block;
    }

    // (51:4) 
    function create_query_slot$6(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$c, create_if_block_1$c, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isFetching*/ ctx[10]) return 0;
    		if (/*isError*/ ctx[11]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "results svelte-fhxlyi");
    			add_location(div0, file$m, 51, 6, 1424);
    			attr_dev(div1, "slot", "query");
    			add_location(div1, file$m, 50, 4, 1350);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_query_slot$6.name,
    		type: "slot",
    		source: "(51:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let query;
    	let current;

    	query = new Query$1({
    			props: {
    				options: /*queryOptions*/ ctx[0],
    				$$slots: {
    					query: [
    						create_query_slot$6,
    						({ queryResult: { data, isFetching, isError } }) => ({ 9: data, 10: isFetching, 11: isError }),
    						({ queryResult: data_data_isFetching_isFetching_isError_isError }) => (data_data_isFetching_isFetching_isError_isError
    						? 512
    						: 0) | (data_data_isFetching_isFetching_isError_isError
    						? 1024
    						: 0) | (data_data_isFetching_isFetching_isError_isError
    						? 2048
    						: 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(query.$$.fragment);
    			attr_dev(div, "class", "wrapper");
    			add_location(div, file$m, 48, 0, 1289);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(query, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const query_changes = {};
    			if (dirty & /*queryOptions*/ 1) query_changes.options = /*queryOptions*/ ctx[0];

    			if (dirty & /*$$scope, isFetching, isError, data, $fieldID*/ 33558018) {
    				query_changes.$$scope = { dirty, ctx };
    			}

    			query.$set(query_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(query.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(query.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(query);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let s;
    	let field;
    	let queryOptions;
    	let $SearchTerm;
    	let $pages;
    	let $fields;
    	let $fieldID;
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(4, $SearchTerm = $$value));
    	validate_store(pages, 'pages');
    	component_subscribe($$self, pages, $$value => $$invalidate(6, $pages = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(5, $fields = $$value));
    	validate_store(fieldID, 'fieldID');
    	component_subscribe($$self, fieldID, $$value => $$invalidate(1, $fieldID = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ViewResult', slots, []);
    	const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;

    	async function fetchPosts({ s, field }) {
    		if ($SearchTerm.length == 0) {
    			const res = await fetch(`${url}?s=tech&page=${$pages}&per_page=10&fields=5`);
    			const data = await res.json();
    			return data;
    		} else if ($fields.length == 0) {
    			const res = await fetch(`${url}?s=${s}&page=${$pages}&per_page=10&fields=7`);
    			const data = await res.json();
    			return data;
    		} else {
    			const res = await fetch(`${url}?s=${s}&page=${$pages}&per_page=10&fields=${field}`);
    			const data = await res.json();
    			return data;
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ViewResult> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ViewResultLoading,
    		fieldID,
    		SearchTerm,
    		fields,
    		pages,
    		Query: Query$1,
    		url,
    		fetchPosts,
    		field,
    		s,
    		queryOptions,
    		$SearchTerm,
    		$pages,
    		$fields,
    		$fieldID
    	});

    	$$self.$inject_state = $$props => {
    		if ('field' in $$props) $$invalidate(2, field = $$props.field);
    		if ('s' in $$props) $$invalidate(3, s = $$props.s);
    		if ('queryOptions' in $$props) $$invalidate(0, queryOptions = $$props.queryOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$SearchTerm*/ 16) {
    			$$invalidate(3, s = $SearchTerm.toLowerCase());
    		}

    		if ($$self.$$.dirty & /*$fields*/ 32) {
    			$$invalidate(2, field = $fields);
    		}

    		if ($$self.$$.dirty & /*s, field, $SearchTerm*/ 28) {
    			$$invalidate(0, queryOptions = {
    				queryKey: ['seeMore', s, field],
    				queryFn: () => fetchPosts({ s, field }),
    				enabled: $SearchTerm !== '' || $SearchTerm === '',
    				keepPreviousData: true,
    				cacheTime: 1000 * 60 * 5,
    				refetchOnWindowFocus: false
    			});
    		}
    	};

    	return [queryOptions, $fieldID, field, s, $SearchTerm, $fields];
    }

    class ViewResult extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ViewResult",
    			options,
    			id: create_fragment$m.name
    		});
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src\components\modal\Modal.svelte generated by Svelte v3.47.0 */

    const { Object: Object_1$1, window: window_1$1 } = globals;
    const file$l = "src\\components\\modal\\Modal.svelte";

    // (354:0) {#if Component}
    function create_if_block$b(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1$b(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-1mkue01"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			toggle_class(div0, "big", /*$fieldID*/ ctx[16] > 0);
    			add_location(div0, file$l, 418, 8, 12702);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-1mkue01"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			toggle_class(div1, "big", /*$fieldID*/ ctx[16] > 0);
    			add_location(div1, file$l, 369, 6, 10735);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-1mkue01"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file$l, 363, 4, 10596);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-1mkue01"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file$l, 354, 2, 10341);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[48](div1);
    			/*div2_binding*/ ctx[49](div2);
    			/*div3_binding*/ ctx[50](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[12])) /*onOpen*/ ctx[12].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[13])) /*onClose*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[14])) /*onOpened*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[15])) /*onClosed*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-1mkue01"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (dirty[0] & /*state, $fieldID*/ 65538) {
    				toggle_class(div0, "big", /*$fieldID*/ ctx[16] > 0);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-1mkue01"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (dirty[0] & /*state, $fieldID*/ 65538) {
    				toggle_class(div1, "big", /*$fieldID*/ ctx[16] > 0);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-1mkue01"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-1mkue01"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[11], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[10], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[11], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[10], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[48](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[49](null);
    			/*div3_binding*/ ctx[50](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(354:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (386:8) {#if state.closeButton}
    function create_if_block_1$b(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$a, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(386:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (389:10) {:else}
    function create_else_block$7(ctx) {
    	let div;
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*$fieldID*/ ctx[16] > 0) return create_if_block_3$7;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			if_block.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-1mkue01"));
    			attr_dev(button, "aria-label", "Close modal");
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file$l, 392, 14, 11630);
    			attr_dev(div, "class", "modal-close svelte-1mkue01");
    			toggle_class(div, "big", /*$fieldID*/ ctx[16] > 0);
    			add_location(div, file$l, 391, 12, 11564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			if_block.m(button, null);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(button, null);
    				}
    			}

    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-1mkue01"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}

    			if (dirty[0] & /*$fieldID*/ 65536) {
    				toggle_class(div, "big", /*$fieldID*/ ctx[16] > 0);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(389:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (387:10) {#if isFunction(state.closeButton)}
    function create_if_block_2$a(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$a.name,
    		type: "if",
    		source: "(387:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    // (408:19) {:else}
    function create_else_block_1$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12.45 37.65 10.35 35.55 21.9 24 10.35 12.45 12.45 10.35 24 21.9 35.55 10.35 37.65 12.45 26.1 24 37.65 35.55 35.55 37.65 24 26.1Z");
    			attr_dev(path, "class", "svelte-1mkue01");
    			add_location(path, file$l, 409, 21, 12380);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "48");
    			attr_dev(svg, "width", "48");
    			attr_dev(svg, "class", "svelte-1mkue01");
    			add_location(svg, file$l, 408, 18, 12295);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(408:19) {:else}",
    		ctx
    	});

    	return block;
    }

    // (399:16) {#if $fieldID > 0}
    function create_if_block_3$7(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M12.45 37.65 10.35 35.55 21.9 24 10.35 12.45 12.45 10.35 24 21.9 35.55 10.35 37.65 12.45 26.1 24 37.65 35.55 35.55 37.65 24 26.1Z");
    			attr_dev(path, "class", "svelte-1mkue01");
    			add_location(path, file$l, 404, 21, 12056);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#fff");
    			attr_dev(svg, "height", "48");
    			attr_dev(svg, "width", "48");
    			attr_dev(svg, "class", "svelte-1mkue01");
    			add_location(svg, file$l, 399, 18, 11875);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$7.name,
    		type: "if",
    		source: "(399:16) {#if $fieldID > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block$b(ctx);
    	const default_slot_template = /*#slots*/ ctx[47].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[46], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1$1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[46],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[46])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[46], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind$1(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let $fieldID;
    	validate_store(fieldID, 'fieldID');
    	component_subscribe($$self, fieldID, $$value => $$invalidate(16, $fieldID = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;
    	let { show = null } = $$props;
    	let { key = 'simple-modal' } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '')
    	: '';

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		cssCloseButton = toCssString(state.styleCloseButton);
    		$$invalidate(10, currentTransitionBg = state.transitionBg);
    		$$invalidate(11, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(2, Component = bind$1(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(12, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch('open');

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch('opening'); // Deprecated. Do not use!
    		});

    		$$invalidate(13, onClose = event => {
    			if (callback.onClose) callback.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch('close');

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch('closing'); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch('opened');
    		});

    		$$invalidate(15, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch('closed');
    		});
    	};

    	const close = (callback = {}) => {
    		if (!Component) return;
    		$$invalidate(13, onClose = callback.onClose || onClose);
    		$$invalidate(15, onClosed = callback.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    		set_store_value(fieldID, $fieldID = 0, $fieldID);
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === 'Escape') {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === 'Tab' && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(node => node.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = 'fixed';
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = 'hidden';
    		document.body.style.width = '100%';
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || '';
    		document.body.style.top = '';
    		document.body.style.overflow = prevBodyOverflow || '';
    		document.body.style.width = prevBodyWidth || '';
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(45, isMounted = true);
    	});

    	const writable_props = [
    		'show',
    		'key',
    		'ariaLabel',
    		'ariaLabelledBy',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'classBg',
    		'classWindowWrap',
    		'classWindow',
    		'classContent',
    		'classCloseButton',
    		'unstyled',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps',
    		'disableFocusTrap'
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('$$scope' in $$props) $$invalidate(46, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fieldID,
    		bind: bind$1,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted,
    		$fieldID
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) cssCloseButton = $$props.cssCloseButton;
    		if ('currentTransitionBg' in $$props) $$invalidate(10, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(11, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(12, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(13, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(14, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(15, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(45, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 4194304 | $$self.$$.dirty[1] & /*isMounted*/ 16384) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		$fieldID,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$l,
    			create_fragment$l,
    			safe_not_equal,
    			{
    				show: 22,
    				key: 23,
    				ariaLabel: 24,
    				ariaLabelledBy: 25,
    				closeButton: 26,
    				closeOnEsc: 27,
    				closeOnOuterClick: 28,
    				styleBg: 29,
    				styleWindowWrap: 30,
    				styleWindow: 31,
    				styleContent: 32,
    				styleCloseButton: 33,
    				classBg: 34,
    				classWindowWrap: 35,
    				classWindow: 36,
    				classContent: 37,
    				classCloseButton: 38,
    				unstyled: 0,
    				setContext: 39,
    				transitionBg: 40,
    				transitionBgProps: 41,
    				transitionWindow: 42,
    				transitionWindowProps: 43,
    				disableFocusTrap: 44
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Table.svelte generated by Svelte v3.47.0 */

    const { console: console_1$4 } = globals;
    const file$k = "src\\components\\Table.svelte";

    function get_each_context$9(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i].posts;
    	child_ctx[9] = list[i].id;
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i].label;
    	child_ctx[22] = i;
    	return child_ctx;
    }

    function get_each_context_3$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i].label;
    	return child_ctx;
    }

    function get_each_context_5$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i].id;
    	child_ctx[18] = list[i].label;
    	return child_ctx;
    }

    function get_each_context_6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (203:14) {#if colsID == id}
    function create_if_block_12$2(ctx) {
    	let th;
    	let t_value = /*label*/ ctx[18] + "";
    	let t;

    	const block = {
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-9univr");
    			add_location(th, file$k, 203, 16, 7645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableheaderData*/ 1 && t_value !== (t_value = /*label*/ ctx[18] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$2.name,
    		type: "if",
    		source: "(203:14) {#if colsID == id}",
    		ctx
    	});

    	return block;
    }

    // (202:12) {#each tableheader as colsID}
    function create_each_block_6(ctx) {
    	let if_block_anchor;
    	let if_block = /*colsID*/ ctx[15] == /*id*/ ctx[9] && create_if_block_12$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*colsID*/ ctx[15] == /*id*/ ctx[9]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_12$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_6.name,
    		type: "each",
    		source: "(202:12) {#each tableheader as colsID}",
    		ctx
    	});

    	return block;
    }

    // (201:10) {#each tableheaderData as { id, label }
    function create_each_block_5$2(key_1, ctx) {
    	let first;
    	let each_1_anchor;
    	let each_value_6 = /*tableheader*/ ctx[1];
    	validate_each_argument(each_value_6);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_6.length; i += 1) {
    		each_blocks[i] = create_each_block_6(get_each_context_6(ctx, each_value_6, i));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*tableheaderData, tableheader*/ 3) {
    				each_value_6 = /*tableheader*/ ctx[1];
    				validate_each_argument(each_value_6);
    				let i;

    				for (i = 0; i < each_value_6.length; i += 1) {
    					const child_ctx = get_each_context_6(ctx, each_value_6, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_6(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_6.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$2.name,
    		type: "each",
    		source: "(201:10) {#each tableheaderData as { id, label }",
    		ctx
    	});

    	return block;
    }

    // (280:44) 
    function create_if_block_11$2(ctx) {
    	let td;
    	let each_value_4 = /*post*/ ctx[12].results;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4$2(get_each_context_4$2(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			td = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td, "class", "table-res svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 280, 16, 10806);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4) {
    				each_value_4 = /*post*/ ctx[12].results;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$2(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$2.name,
    		type: "if",
    		source: "(280:44) ",
    		ctx
    	});

    	return block;
    }

    // (276:46) 
    function create_if_block_10$2(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[12].targetDM + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "table-dm svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 276, 16, 10622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && t_value !== (t_value = /*post*/ ctx[12].targetDM + "")) set_data_dev(t, t_value);

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$2.name,
    		type: "if",
    		source: "(276:46) ",
    		ctx
    	});

    	return block;
    }

    // (272:52) 
    function create_if_block_9$2(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[12].targetIndustry + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "table-ind svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 272, 16, 10429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && t_value !== (t_value = /*post*/ ctx[12].targetIndustry + "")) set_data_dev(t, t_value);

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$2.name,
    		type: "if",
    		source: "(272:52) ",
    		ctx
    	});

    	return block;
    }

    // (268:52) 
    function create_if_block_8$2(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[12].targetLocation + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "table-td svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 268, 16, 10231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && t_value !== (t_value = /*post*/ ctx[12].targetLocation + "")) set_data_dev(t, t_value);

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$2.name,
    		type: "if",
    		source: "(268:52) ",
    		ctx
    	});

    	return block;
    }

    // (264:45) 
    function create_if_block_7$2(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[12].clientHQ + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "table-td svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 264, 16, 10039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && t_value !== (t_value = /*post*/ ctx[12].clientHQ + "")) set_data_dev(t, t_value);

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$2.name,
    		type: "if",
    		source: "(264:45) ",
    		ctx
    	});

    	return block;
    }

    // (258:40) 
    function create_if_block_6$2(ctx) {
    	let td;
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			td = element("td");
    			a = element("a");
    			t = text("See PDF");
    			attr_dev(a, "class", "cs_linkunlock svelte-9univr");
    			attr_dev(a, "href", a_href_value = /*post*/ ctx[12].pdf);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$k, 259, 19, 9841);
    			attr_dev(td, "class", "table-td svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 258, 16, 9759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && a_href_value !== (a_href_value = /*post*/ ctx[12].pdf)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(258:40) ",
    		ctx
    	});

    	return block;
    }

    // (247:49) 
    function create_if_block_5$2(ctx) {
    	let td;
    	let div;
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			td = element("td");
    			div = element("div");
    			a = element("a");
    			t = text("See full version");
    			attr_dev(a, "class", "cs_linkunlock svelte-9univr");
    			attr_dev(a, "href", a_href_value = /*post*/ ctx[12].linkUnlocked);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$k, 249, 20, 9449);
    			attr_dev(div, "class", "link-unlock svelte-9univr");
    			add_location(div, file$k, 248, 19, 9402);
    			attr_dev(td, "class", "table-td svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 247, 16, 9320);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, div);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && a_href_value !== (a_href_value = /*post*/ ctx[12].linkUnlocked)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(247:49) ",
    		ctx
    	});

    	return block;
    }

    // (241:41) 
    function create_if_block_4$3(ctx) {
    	let td;
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			td = element("td");
    			a = element("a");
    			t = text("See Webpage");
    			attr_dev(a, "class", "cs_linkunlock svelte-9univr");
    			attr_dev(a, "href", a_href_value = /*post*/ ctx[12].link);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$k, 242, 19, 9113);
    			attr_dev(td, "class", "table-td svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 241, 16, 9031);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && a_href_value !== (a_href_value = /*post*/ ctx[12].link)) {
    				attr_dev(a, "href", a_href_value);
    			}

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(241:41) ",
    		ctx
    	});

    	return block;
    }

    // (235:45) 
    function create_if_block_3$6(ctx) {
    	let td;
    	let each_value_3 = /*post*/ ctx[12].campaign;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$2(get_each_context_3$2(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			td = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td, "class", "table-td svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 235, 16, 8756);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4) {
    				each_value_3 = /*post*/ ctx[12].campaign;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$2(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$6.name,
    		type: "if",
    		source: "(235:45) ",
    		ctx
    	});

    	return block;
    }

    // (231:44) 
    function create_if_block_2$9(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[12].product + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "table-td svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 231, 16, 8572);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && t_value !== (t_value = /*post*/ ctx[12].product + "")) set_data_dev(t, t_value);

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$9.name,
    		type: "if",
    		source: "(231:44) ",
    		ctx
    	});

    	return block;
    }

    // (227:52) 
    function create_if_block_1$a(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[12].clientLocation + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "table-td svelte-9univr");
    			toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(td, file$k, 227, 16, 8382);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && t_value !== (t_value = /*post*/ ctx[12].clientLocation + "")) set_data_dev(t, t_value);

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(td, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(227:52) ",
    		ctx
    	});

    	return block;
    }

    // (216:14) {#if colsID == 'title'}
    function create_if_block$a(ctx) {
    	let td;
    	let t0_value = /*post*/ ctx[12].title + "";
    	let t0;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[4](/*post*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			t0 = text(t0_value);
    			t1 = space();
    			button = element("button");
    			button.textContent = "Preview";
    			attr_dev(button, "class", "hide svelte-9univr");
    			toggle_class(button, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			add_location(button, file$k, 218, 18, 8050);
    			attr_dev(td, "class", "table-title svelte-9univr");
    			add_location(td, file$k, 216, 16, 7974);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t0);
    			append_dev(td, t1);
    			append_dev(td, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*tableData*/ 4 && t0_value !== (t0_value = /*post*/ ctx[12].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*tableheader*/ 2) {
    				toggle_class(button, "btn-repo", /*tableheader*/ ctx[1].length >= 4);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(216:14) {#if colsID == 'title'}",
    		ctx
    	});

    	return block;
    }

    // (282:18) {#each post.results as { label }
    function create_each_block_4$2(ctx) {
    	let span;

    	let t_value = (/*index*/ ctx[22] == /*post*/ ctx[12].results.length - 1
    	? /*label*/ ctx[18]
    	: `${/*label*/ ctx[18]}, `) + "";

    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$k, 282, 20, 10951);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && t_value !== (t_value = (/*index*/ ctx[22] == /*post*/ ctx[12].results.length - 1
    			? /*label*/ ctx[18]
    			: `${/*label*/ ctx[18]}, `) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$2.name,
    		type: "each",
    		source: "(282:18) {#each post.results as { label }",
    		ctx
    	});

    	return block;
    }

    // (237:18) {#each post.campaign as { label }}
    function create_each_block_3$2(ctx) {
    	let span;
    	let t_value = /*label*/ ctx[18] + "";
    	let t;
    	let br;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			br = element("br");
    			add_location(span, file$k, 237, 20, 8894);
    			add_location(br, file$k, 237, 40, 8914);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    			insert_dev(target, br, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableData*/ 4 && t_value !== (t_value = /*label*/ ctx[18] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$2.name,
    		type: "each",
    		source: "(237:18) {#each post.campaign as { label }}",
    		ctx
    	});

    	return block;
    }

    // (215:12) {#each tableheader as colsID}
    function create_each_block_2$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*colsID*/ ctx[15] == 'title') return create_if_block$a;
    		if (/*colsID*/ ctx[15] == 'client-location') return create_if_block_1$a;
    		if (/*colsID*/ ctx[15] == 'product') return create_if_block_2$9;
    		if (/*colsID*/ ctx[15] == 'campaign') return create_if_block_3$6;
    		if (/*colsID*/ ctx[15] == 'link') return create_if_block_4$3;
    		if (/*colsID*/ ctx[15] == 'linkUnlocked') return create_if_block_5$2;
    		if (/*colsID*/ ctx[15] == 'pdf') return create_if_block_6$2;
    		if (/*colsID*/ ctx[15] == 'clientHQ') return create_if_block_7$2;
    		if (/*colsID*/ ctx[15] == 'target-location') return create_if_block_8$2;
    		if (/*colsID*/ ctx[15] == 'target-industry') return create_if_block_9$2;
    		if (/*colsID*/ ctx[15] == 'target-dm') return create_if_block_10$2;
    		if (/*colsID*/ ctx[15] == 'results') return create_if_block_11$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(215:12) {#each tableheader as colsID}",
    		ctx
    	});

    	return block;
    }

    // (211:8) {#each posts as post}
    function create_each_block_1$2(ctx) {
    	let tr;
    	let t;
    	let each_value_2 = /*tableheader*/ ctx[1];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(tr, "class", "svelte-9univr");
    			add_location(tr, file$k, 211, 10, 7811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tableheader, onClick, tableData*/ 14) {
    				each_value_2 = /*tableheader*/ ctx[1];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(211:8) {#each posts as post}",
    		ctx
    	});

    	return block;
    }

    // (197:2) {#each tableData as { posts, id }
    function create_each_block$9(key_1, ctx) {
    	let table;
    	let thead;
    	let tr;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t0;
    	let tbody;
    	let t1;
    	let each_value_5 = /*tableheaderData*/ ctx[0];
    	validate_each_argument(each_value_5);
    	const get_key = ctx => /*id*/ ctx[9];
    	validate_each_keys(ctx, each_value_5, get_each_context_5$2, get_key);

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		let child_ctx = get_each_context_5$2(ctx, each_value_5, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_5$2(key, child_ctx));
    	}

    	let each_value_1 = /*posts*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			attr_dev(tr, "class", "svelte-9univr");
    			add_location(tr, file$k, 199, 8, 7489);
    			attr_dev(thead, "class", "svelte-9univr");
    			add_location(thead, file$k, 198, 6, 7472);
    			attr_dev(tbody, "class", "svelte-9univr");
    			add_location(tbody, file$k, 209, 6, 7761);
    			attr_dev(table, "class", "svelte-9univr");
    			add_location(table, file$k, 197, 4, 7457);
    			this.first = table;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t0);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(table, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*tableheader, tableheaderData*/ 3) {
    				each_value_5 = /*tableheaderData*/ ctx[0];
    				validate_each_argument(each_value_5);
    				validate_each_keys(ctx, each_value_5, get_each_context_5$2, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_5, each0_lookup, tr, destroy_block, create_each_block_5$2, null, get_each_context_5$2);
    			}

    			if (dirty & /*tableheader, onClick, tableData*/ 14) {
    				each_value_1 = /*posts*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$9.name,
    		type: "each",
    		source: "(197:2) {#each tableData as { posts, id }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*tableData*/ ctx[2];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[9];
    	validate_each_keys(ctx, each_value, get_each_context$9, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$9(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$9(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "table-wrapper");
    			add_location(div, file$k, 195, 0, 7381);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tableData, tableheader, onClick, tableheaderData*/ 15) {
    				each_value = /*tableData*/ ctx[2];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$9, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$9, null, get_each_context$9);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $fieldID;
    	validate_store(fieldID, 'fieldID');
    	component_subscribe($$self, fieldID, $$value => $$invalidate(5, $fieldID = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Table', slots, []);
    	let { tableheaderData = [{ id: 'hello', label: 'dolorem' }, { id: 'world', label: 'amet' }] } = $$props;
    	let { tableheader = ['nani', 'nandato'] } = $$props;

    	let { tableData = [
    		{
    			n: 3,
    			id: 'client-location',
    			label: 'Client Location/HQ',
    			icon: 'location_on',
    			posts: [
    				{
    					id: 74422,
    					link: 'https://www.callboxinc.com/case-studies/insurance-tech-innovator-claimed-insurance-made-easy-all-over-the-us/',
    					title: 'Insurance Tech Innovator Claimed “Insurance Made Easy” All over the US',
    					excerpt: 'The Client is a global leader in insurance technology, serving hundreds of carriers and agents, brokers, and other industry players in more than 30 countries.',
    					image: 'https://www.callboxinc.com/wp-content/uploads/2022/04/CS_SW_Insurance-Tech-Innovator-Claimed-Insurance-Made-Easy-All-over-the-US-img-768x432.webp',
    					clientLocation: 'USA',
    					product: 'Software',
    					campaign: [
    						{ value: '0', label: 'Lead Generation' },
    						{ value: '1', label: 'Appointment Setting' }
    					],
    					linkUnlocked: 'https://www.callboxinc.com/case-studies/insurance-tech-innovator-claimed-insurance-made-easy-all-over-the-us/?user=benb',
    					pdf: 'https://www.callboxinc.com/external/casestudies/CS_SW_Insurance-Tech-Innovator-Claimed-Insurance-Made-Easy-All-over-the-US.pdf',
    					clientHQ: 'Shanghai, China',
    					targetLocation: 'All over US',
    					targetIndustry: 'Property Casualty Insurance',
    					targetDM: 'CIO, CTO, Product Manager, Claims Manager, Lead Technical Architect, Digital Officer, Underwriting Manager, Chief Operating Officer',
    					results: [
    						{
    							label: 'Sales Qualified Leads',
    							value: '88'
    						},
    						{
    							label: 'Marketing Qualified Leads',
    							value: '68'
    						},
    						{ label: 'Profiled Contacts', value: '651' },
    						{
    							label: 'Social Media Connections',
    							value: '1485'
    						}
    					]
    				}
    			],
    			total: 7,
    			hasMore: true
    		},
    		{
    			n: 4,
    			id: 'target-location',
    			label: 'Target Location',
    			icon: 'location_on',
    			posts: [
    				{
    					id: 68153,
    					link: 'https://www.callboxinc.com/case-studies/top-telco-found-new-iot-partners-using-callbox-account-based-marketing/',
    					title: 'Global Telco Widens APAC Market with Callbox Lead Generation Campaign',
    					excerpt: 'The Client is a leading telecommunications provider, offering the latest voice and data solutions to multinational enterprises and communication service providers, with a global coverage combined with local, on the ground knowledge that builds best in class connections across the globe.',
    					image: 'https://www.callboxinc.com/wp-content/uploads/2022/03/CS_IT_Global-Telco-Widens-APAC-Market-with-Callbox-Lead-Generation-Campaign-768x432.webp',
    					clientLocation: 'Singapore',
    					product: 'IT',
    					campaign: [
    						{ value: '0', label: 'Lead Generation' },
    						{ value: '1', label: 'Appointment Setting' }
    					],
    					linkUnlocked: 'https://www.callboxinc.com/case-studies/top-telco-found-new-iot-partners-using-callbox-account-based-marketing/?user=benb',
    					pdf: 'https://www.callboxinc.com/external/casestudies/CS_IT_Global-Telco-Widens-APAC-Market-with-Callbox-Lead-Generation-Campaign.pdf',
    					clientHQ: 'Hong Kong',
    					targetLocation: 'China, Hong Kong, Japan, Singapore, South Korea, Taiwan, Australia, Indonesia, Thailand, Vietnam, India',
    					targetIndustry: 'Any (Employee Size: 20 up, Annual Rev: USD20M$ up)',
    					targetDM: 'CEO, CCO, CMO, IoT Business Unit Heads, Partnership Managers, Marketing Managers, VP of Marketing, Product Managers, VP of Products, Sales Managers, VP of Sales, Practice Managers, Senior Consultants, Project Managers, CTO, Internet of Things Experts/Managers, Information Technology Experts/Managers, CFO, Finance Manager',
    					results: [
    						{
    							label: 'Sales Qualified Leads',
    							value: '72'
    						},
    						{
    							label: 'Marketing Qualified Leads',
    							value: '155'
    						},
    						{
    							label: 'Social Media Connections',
    							value: '1192'
    						}
    					]
    				}
    			],
    			total: 2,
    			hasMore: true
    		},
    		{
    			n: 7,
    			id: 'content',
    			label: 'Others',
    			icon: 'text_snippet',
    			posts: [
    				{
    					id: 73678,
    					link: 'https://www.callboxinc.com/case-studies/ict-lead-caps-app-upgrade-for-channel-partner-with-callbox-abm/',
    					title: 'ICT Lead Caps App Upgrade for Channel Partner with Callbox ABM',
    					excerpt: 'The Client is a leading ICT products and services provider in the APAC region with a network of more than 40,000 active channel partners.',
    					image: 'https://www.callboxinc.com/wp-content/uploads/2022/02/CS_IT_ICT-Lead-Caps-App-Upgrade-for-Channel-Partner-with-Callbox-ABM-img-768x432.webp',
    					clientLocation: 'Singapore',
    					product: 'IT / Software',
    					campaign: [
    						{ value: '0', label: 'Lead Generation' },
    						{ value: '1', label: 'Appointment Setting' }
    					],
    					linkUnlocked: 'https://www.callboxinc.com/case-studies/ict-lead-caps-app-upgrade-for-channel-partner-with-callbox-abm/?user=benb',
    					pdf: 'https://www.callboxinc.com/external/casestudies/CS_IT_ICT-Lead-Caps-App-Upgrade-for-Channel-Partner-with-Callbox-ABM.pdf',
    					clientHQ: 'Singapore',
    					targetLocation: 'Philippines',
    					targetIndustry: 'All, small to medium (except competitors)',
    					targetDM: 'IT Director/Manager, Owner, General Manager, Managing Director',
    					results: [
    						{
    							label: 'Marketing-Qualified Leads',
    							value: '200'
    						},
    						{
    							label: 'Social Media Connections',
    							value: '263'
    						}
    					]
    				}
    			],
    			total: 4,
    			hasMore: true
    		}
    	] } = $$props;

    	function onClick(value) {
    		set_store_value(fieldID, $fieldID = value, $fieldID);
    	} //$viewfield = true;
    	// $isSearching = false;

    	const modalss = writable(null);
    	const showModaall = () => modalss.set(bind$1(ViewResult));
    	console.log($fieldID);
    	const writable_props = ['tableheaderData', 'tableheader', 'tableData'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Table> was created with unknown prop '${key}'`);
    	});

    	const click_handler = post => onClick(post.id);

    	$$self.$$set = $$props => {
    		if ('tableheaderData' in $$props) $$invalidate(0, tableheaderData = $$props.tableheaderData);
    		if ('tableheader' in $$props) $$invalidate(1, tableheader = $$props.tableheader);
    		if ('tableData' in $$props) $$invalidate(2, tableData = $$props.tableData);
    	};

    	$$self.$capture_state = () => ({
    		fieldID,
    		tableheaderData,
    		tableheader,
    		tableData,
    		onClick,
    		ViewResult,
    		Modal: Modal$1,
    		bind: bind$1,
    		writable,
    		modalss,
    		showModaall,
    		$fieldID
    	});

    	$$self.$inject_state = $$props => {
    		if ('tableheaderData' in $$props) $$invalidate(0, tableheaderData = $$props.tableheaderData);
    		if ('tableheader' in $$props) $$invalidate(1, tableheader = $$props.tableheader);
    		if ('tableData' in $$props) $$invalidate(2, tableData = $$props.tableData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tableheaderData, tableheader, tableData, onClick, click_handler];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			tableheaderData: 0,
    			tableheader: 1,
    			tableData: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get tableheaderData() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableheaderData(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tableheader() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableheader(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tableData() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tableData(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const PREVIOUS_PAGE = 'PREVIOUS_PAGE';
    const NEXT_PAGE = 'NEXT_PAGE';
    const ELLIPSIS = 'ELLIPSIS';

    function generateNavigationOptions ({
      totalItems,
      pageSize,
      currentPage,
      limit = null,
      showStepOptions = false,
    }) {
      const totalPages = Math.ceil(totalItems / pageSize);
      const limitThreshold = getLimitThreshold({ limit });
      const limited = limit && totalPages > limitThreshold;
      let options = limited
        ? generateLimitedOptions({ totalPages, limit, currentPage })
        : generateUnlimitedOptions({ totalPages });
      return showStepOptions
        ? addStepOptions({ options, currentPage, totalPages })
        : options;
    }

    function generateUnlimitedOptions({ totalPages }) {
      return new Array(totalPages).fill(null).map((value, index) => ({
        type: 'number',
        value: index + 1,
      }));
    }

    function generateLimitedOptions({ totalPages, limit, currentPage }) {
      const boundarySize = limit * 2 + 2;
      const firstBoundary = 1 + boundarySize;
      const lastBoundary = totalPages - boundarySize;
      const totalShownPages = firstBoundary + 2;

      if (currentPage <= firstBoundary - limit) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === totalShownPages - 1) {
              return {
                type: 'number',
                value: totalPages,
              };
            } else if (index === totalShownPages - 2) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: firstBoundary + 1,
              };
            }
            return {
              type: 'number',
              value: index + 1,
            };
          });
      } else if (currentPage >= lastBoundary + limit) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === 0) {
              return {
                type: 'number',
                value: 1,
              };
            } else if (index === 1) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: lastBoundary - 1,
              };
            }
            return {
              type: 'number',
              value: lastBoundary + index - 2,
            };
          });
      } else if (
        currentPage >= firstBoundary - limit &&
        currentPage <= lastBoundary + limit
      ) {
        return Array(totalShownPages)
          .fill(null)
          .map((value, index) => {
            if (index === 0) {
              return {
                type: 'number',
                value: 1,
              };
            } else if (index === 1) {
              return {
                type: 'symbol',
                symbol: PREVIOUS_PAGE,
                value: currentPage - limit + (index - 2),
              };
            } else if (index === totalShownPages - 1) {
              return {
                type: 'number',
                value: totalPages,
              };
            } else if (index === totalShownPages - 2) {
              return {
                type: 'symbol',
                symbol: ELLIPSIS,
                value: currentPage + limit + 1,
              };
            }
            return {
              type: 'number',
              value: currentPage - limit + (index - 2),
            };
          });
      }
    }

    function addStepOptions({ options, currentPage, totalPages }) {
      return [
        {
          type: 'symbol',
          symbol: PREVIOUS_PAGE,
          value: currentPage <= 1 ? 1 : currentPage - 1,
        },
        ...options,
        {
          type: 'symbol',
          symbol: NEXT_PAGE,
          value: currentPage >= totalPages ? totalPages : currentPage + 1,
        },
      ];
    }

    function getLimitThreshold({ limit }) {
      const maximumUnlimitedPages = 3; // This means we cannot limit 3 pages or less
      const numberOfBoundaryPages = 2; // The first and last pages are always shown
      return limit * 2 + maximumUnlimitedPages + numberOfBoundaryPages;
    }

    /* src\components\pagination\PaginationNav.svelte generated by Svelte v3.47.0 */
    const file$j = "src\\components\\pagination\\PaginationNav.svelte";

    function get_each_context$8(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    const get_next_slot_changes = dirty => ({});
    const get_next_slot_context = ctx => ({});
    const get_prev_slot_changes = dirty => ({});
    const get_prev_slot_context = ctx => ({});
    const get_ellipsis_slot_changes = dirty => ({});
    const get_ellipsis_slot_context = ctx => ({});
    const get_number_slot_changes = dirty => ({ value: dirty & /*options*/ 4 });
    const get_number_slot_context = ctx => ({ value: /*option*/ ctx[12].value });

    // (77:72) 
    function create_if_block_3$5(ctx) {
    	let current;
    	const next_slot_template = /*#slots*/ ctx[9].next;
    	const next_slot = create_slot(next_slot_template, ctx, /*$$scope*/ ctx[8], get_next_slot_context);
    	const next_slot_or_fallback = next_slot || fallback_block_3(ctx);

    	const block = {
    		c: function create() {
    			if (next_slot_or_fallback) next_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (next_slot_or_fallback) {
    				next_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (next_slot) {
    				if (next_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						next_slot,
    						next_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(next_slot_template, /*$$scope*/ ctx[8], dirty, get_next_slot_changes),
    						get_next_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(next_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(next_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (next_slot_or_fallback) next_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$5.name,
    		type: "if",
    		source: "(77:72) ",
    		ctx
    	});

    	return block;
    }

    // (63:76) 
    function create_if_block_2$8(ctx) {
    	let current;
    	const prev_slot_template = /*#slots*/ ctx[9].prev;
    	const prev_slot = create_slot(prev_slot_template, ctx, /*$$scope*/ ctx[8], get_prev_slot_context);
    	const prev_slot_or_fallback = prev_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (prev_slot_or_fallback) {
    				prev_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (prev_slot) {
    				if (prev_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						prev_slot,
    						prev_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(prev_slot_template, /*$$scope*/ ctx[8], dirty, get_prev_slot_changes),
    						get_prev_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(prev_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(prev_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (prev_slot_or_fallback) prev_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$8.name,
    		type: "if",
    		source: "(63:76) ",
    		ctx
    	});

    	return block;
    }

    // (49:71) 
    function create_if_block_1$9(ctx) {
    	let current;
    	const ellipsis_slot_template = /*#slots*/ ctx[9].ellipsis;
    	const ellipsis_slot = create_slot(ellipsis_slot_template, ctx, /*$$scope*/ ctx[8], get_ellipsis_slot_context);
    	const ellipsis_slot_or_fallback = ellipsis_slot || fallback_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (ellipsis_slot_or_fallback) ellipsis_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (ellipsis_slot_or_fallback) {
    				ellipsis_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (ellipsis_slot) {
    				if (ellipsis_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						ellipsis_slot,
    						ellipsis_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(ellipsis_slot_template, /*$$scope*/ ctx[8], dirty, get_ellipsis_slot_changes),
    						get_ellipsis_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ellipsis_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ellipsis_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (ellipsis_slot_or_fallback) ellipsis_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(49:71) ",
    		ctx
    	});

    	return block;
    }

    // (45:6) {#if option.type === 'number'}
    function create_if_block$9(ctx) {
    	let current;
    	const number_slot_template = /*#slots*/ ctx[9].number;
    	const number_slot = create_slot(number_slot_template, ctx, /*$$scope*/ ctx[8], get_number_slot_context);
    	const number_slot_or_fallback = number_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (number_slot_or_fallback) number_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (number_slot_or_fallback) {
    				number_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (number_slot) {
    				if (number_slot.p && (!current || dirty & /*$$scope, options*/ 260)) {
    					update_slot_base(
    						number_slot,
    						number_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(number_slot_template, /*$$scope*/ ctx[8], dirty, get_number_slot_changes),
    						get_number_slot_context
    					);
    				}
    			} else {
    				if (number_slot_or_fallback && number_slot_or_fallback.p && (!current || dirty & /*options*/ 4)) {
    					number_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(number_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(number_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (number_slot_or_fallback) number_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(45:6) {#if option.type === 'number'}",
    		ctx
    	});

    	return block;
    }

    // (78:26)             
    function fallback_block_3(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$j, 85, 13, 2930);
    			attr_dev(path1, "d", "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z");
    			add_location(path1, file$j, 85, 51, 2968);
    			attr_dev(svg, "class", "icon");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "black");
    			attr_dev(svg, "width", "24px");
    			attr_dev(svg, "height", "24px");
    			add_location(svg, file$j, 78, 10, 2725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(78:26)             ",
    		ctx
    	});

    	return block;
    }

    // (64:26)             
    function fallback_block_2(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$j, 71, 13, 2436);
    			attr_dev(path1, "d", "M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z");
    			add_location(path1, file$j, 71, 51, 2474);
    			attr_dev(svg, "class", "icon");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "black");
    			attr_dev(svg, "width", "24px");
    			attr_dev(svg, "height", "24px");
    			add_location(svg, file$j, 64, 10, 2231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(64:26)             ",
    		ctx
    	});

    	return block;
    }

    // (50:30)             
    function fallback_block_1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$j, 57, 13, 1953);
    			attr_dev(path1, "d", "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z");
    			add_location(path1, file$j, 57, 51, 1991);
    			attr_dev(svg, "class", "icon");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "black");
    			attr_dev(svg, "width", "24px");
    			attr_dev(svg, "height", "24px");
    			add_location(svg, file$j, 50, 10, 1748);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(50:30)             ",
    		ctx
    	});

    	return block;
    }

    // (46:49)             
    function fallback_block(ctx) {
    	let span;
    	let t_value = /*option*/ ctx[12].value + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$j, 46, 10, 1586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 4 && t_value !== (t_value = /*option*/ ctx[12].value + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(46:49)             ",
    		ctx
    	});

    	return block;
    }

    // (29:2) {#each options as option}
    function create_each_block$8(ctx) {
    	let span;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$9, create_if_block_1$9, create_if_block_2$8, create_if_block_3$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*option*/ ctx[12].type === 'number') return 0;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS) return 1;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE) return 2;
    		if (/*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*option*/ ctx[12]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(span, "class", "option");
    			toggle_class(span, "number", /*option*/ ctx[12].type === 'number');
    			toggle_class(span, "prev", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE);
    			toggle_class(span, "next", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE);
    			toggle_class(span, "disabled", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE && /*currentPage*/ ctx[0] >= /*totalPages*/ ctx[1] || /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE && /*currentPage*/ ctx[0] <= 1);
    			toggle_class(span, "ellipsis", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS);
    			toggle_class(span, "active", /*option*/ ctx[12].type === 'number' && /*option*/ ctx[12].value === /*currentPage*/ ctx[0]);
    			add_location(span, file$j, 29, 4, 795);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(span, null);
    			}

    			append_dev(span, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(span, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(span, t);
    				} else {
    					if_block = null;
    				}
    			}

    			if (dirty & /*options*/ 4) {
    				toggle_class(span, "number", /*option*/ ctx[12].type === 'number');
    			}

    			if (dirty & /*options, PREVIOUS_PAGE*/ 4) {
    				toggle_class(span, "prev", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE);
    			}

    			if (dirty & /*options, NEXT_PAGE*/ 4) {
    				toggle_class(span, "next", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE);
    			}

    			if (dirty & /*options, NEXT_PAGE, currentPage, totalPages, PREVIOUS_PAGE*/ 7) {
    				toggle_class(span, "disabled", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === NEXT_PAGE && /*currentPage*/ ctx[0] >= /*totalPages*/ ctx[1] || /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === PREVIOUS_PAGE && /*currentPage*/ ctx[0] <= 1);
    			}

    			if (dirty & /*options, ELLIPSIS*/ 4) {
    				toggle_class(span, "ellipsis", /*option*/ ctx[12].type === 'symbol' && /*option*/ ctx[12].symbol === ELLIPSIS);
    			}

    			if (dirty & /*options, currentPage*/ 5) {
    				toggle_class(span, "active", /*option*/ ctx[12].type === 'number' && /*option*/ ctx[12].value === /*currentPage*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$8.name,
    		type: "each",
    		source: "(29:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let current;
    	let each_value = /*options*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "pagination-nav");
    			add_location(div, file$j, 27, 0, 732);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options, PREVIOUS_PAGE, NEXT_PAGE, currentPage, totalPages, ELLIPSIS, handleOptionClick, $$scope*/ 271) {
    				each_value = /*options*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$8(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$8(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let options;
    	let totalPages;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PaginationNav', slots, ['number','ellipsis','prev','next']);
    	const dispatch = createEventDispatcher();
    	let { totalItems = 0 } = $$props;
    	let { pageSize = 1 } = $$props;
    	let { currentPage = 1 } = $$props;
    	let { limit = null } = $$props;
    	let { showStepOptions = false } = $$props;

    	function handleOptionClick(option) {
    		dispatch('setPage', { page: option.value });
    	}

    	const writable_props = ['totalItems', 'pageSize', 'currentPage', 'limit', 'showStepOptions'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PaginationNav> was created with unknown prop '${key}'`);
    	});

    	const click_handler = option => handleOptionClick(option);

    	$$self.$$set = $$props => {
    		if ('totalItems' in $$props) $$invalidate(4, totalItems = $$props.totalItems);
    		if ('pageSize' in $$props) $$invalidate(5, pageSize = $$props.pageSize);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('limit' in $$props) $$invalidate(6, limit = $$props.limit);
    		if ('showStepOptions' in $$props) $$invalidate(7, showStepOptions = $$props.showStepOptions);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		generateNavigationOptions,
    		PREVIOUS_PAGE,
    		NEXT_PAGE,
    		ELLIPSIS,
    		dispatch,
    		totalItems,
    		pageSize,
    		currentPage,
    		limit,
    		showStepOptions,
    		handleOptionClick,
    		totalPages,
    		options
    	});

    	$$self.$inject_state = $$props => {
    		if ('totalItems' in $$props) $$invalidate(4, totalItems = $$props.totalItems);
    		if ('pageSize' in $$props) $$invalidate(5, pageSize = $$props.pageSize);
    		if ('currentPage' in $$props) $$invalidate(0, currentPage = $$props.currentPage);
    		if ('limit' in $$props) $$invalidate(6, limit = $$props.limit);
    		if ('showStepOptions' in $$props) $$invalidate(7, showStepOptions = $$props.showStepOptions);
    		if ('totalPages' in $$props) $$invalidate(1, totalPages = $$props.totalPages);
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*totalItems, pageSize, currentPage, limit, showStepOptions*/ 241) {
    			$$invalidate(2, options = generateNavigationOptions({
    				totalItems,
    				pageSize,
    				currentPage,
    				limit,
    				showStepOptions
    			}));
    		}

    		if ($$self.$$.dirty & /*totalItems, pageSize*/ 48) {
    			$$invalidate(1, totalPages = Math.ceil(totalItems / pageSize));
    		}
    	};

    	return [
    		currentPage,
    		totalPages,
    		options,
    		handleOptionClick,
    		totalItems,
    		pageSize,
    		limit,
    		showStepOptions,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class PaginationNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			totalItems: 4,
    			pageSize: 5,
    			currentPage: 0,
    			limit: 6,
    			showStepOptions: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PaginationNav",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get totalItems() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set totalItems(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pageSize() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pageSize(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get currentPage() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set currentPage(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get limit() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set limit(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showStepOptions() {
    		throw new Error("<PaginationNav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showStepOptions(value) {
    		throw new Error("<PaginationNav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\pagination\LightPaginationNav.svelte generated by Svelte v3.47.0 */
    const file$i = "src\\components\\pagination\\LightPaginationNav.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let paginationnav;
    	let current;
    	const paginationnav_spread_levels = [/*$$props*/ ctx[0]];
    	let paginationnav_props = {};

    	for (let i = 0; i < paginationnav_spread_levels.length; i += 1) {
    		paginationnav_props = assign(paginationnav_props, paginationnav_spread_levels[i]);
    	}

    	paginationnav = new PaginationNav({
    			props: paginationnav_props,
    			$$inline: true
    		});

    	paginationnav.$on("setPage", /*setPage_handler*/ ctx[1]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(paginationnav.$$.fragment);
    			attr_dev(div, "class", "light-pagination-nav svelte-1mytkc1");
    			add_location(div, file$i, 4, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(paginationnav, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const paginationnav_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(paginationnav_spread_levels, [get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			paginationnav.$set(paginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(paginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(paginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(paginationnav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LightPaginationNav', slots, []);

    	function setPage_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ PaginationNav });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props, setPage_handler];
    }

    class LightPaginationNav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LightPaginationNav",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\components\TableLoading.svelte generated by Svelte v3.47.0 */
    const file$h = "src\\components\\TableLoading.svelte";

    function get_each_context$7(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (22:8) {#each loading as load}
    function create_each_block$7(ctx) {
    	let tr;
    	let td0;
    	let skeleton0;
    	let t0;
    	let td1;
    	let skeleton1;
    	let t1;
    	let td2;
    	let skeleton2;
    	let t2;
    	let current;

    	skeleton0 = new Skeleton({
    			props: { height: "18", width: /*load*/ ctx[2] },
    			$$inline: true
    		});

    	skeleton1 = new Skeleton({
    			props: { height: "20", width: "80" },
    			$$inline: true
    		});

    	skeleton2 = new Skeleton({
    			props: { height: "40", width: "90" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			create_component(skeleton0.$$.fragment);
    			t0 = space();
    			td1 = element("td");
    			create_component(skeleton1.$$.fragment);
    			t1 = space();
    			td2 = element("td");
    			create_component(skeleton2.$$.fragment);
    			t2 = space();
    			attr_dev(td0, "class", "svelte-1ecr5l5");
    			add_location(td0, file$h, 23, 12, 636);
    			attr_dev(td1, "class", "table-td svelte-1ecr5l5");
    			add_location(td1, file$h, 24, 12, 697);
    			attr_dev(td2, "class", "table-td svelte-1ecr5l5");
    			add_location(td2, file$h, 25, 12, 773);
    			attr_dev(tr, "class", "svelte-1ecr5l5");
    			add_location(tr, file$h, 22, 10, 618);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			mount_component(skeleton0, td0, null);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			mount_component(skeleton1, td1, null);
    			append_dev(tr, t1);
    			append_dev(tr, td2);
    			mount_component(skeleton2, td2, null);
    			append_dev(tr, t2);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skeleton0.$$.fragment, local);
    			transition_in(skeleton1.$$.fragment, local);
    			transition_in(skeleton2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skeleton0.$$.fragment, local);
    			transition_out(skeleton1.$$.fragment, local);
    			transition_out(skeleton2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(skeleton0);
    			destroy_component(skeleton1);
    			destroy_component(skeleton2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$7.name,
    		type: "each",
    		source: "(22:8) {#each loading as load}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let h2;
    	let t1;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let tbody;
    	let t8;
    	let div2;
    	let current;
    	let each_value = /*loading*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Case Studies";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Title";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "PRODUCT OR SERVICE";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "PDF";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div2 = element("div");
    			attr_dev(h2, "class", "table-label svelte-1ecr5l5");
    			add_location(h2, file$h, 8, 0, 232);
    			attr_dev(th0, "class", "svelte-1ecr5l5");
    			add_location(th0, file$h, 14, 10, 389);
    			attr_dev(th1, "class", "svelte-1ecr5l5");
    			add_location(th1, file$h, 15, 10, 417);
    			attr_dev(th2, "class", "svelte-1ecr5l5");
    			add_location(th2, file$h, 16, 10, 458);
    			attr_dev(tr, "class", "svelte-1ecr5l5");
    			add_location(tr, file$h, 13, 8, 373);
    			attr_dev(thead, "class", "svelte-1ecr5l5");
    			add_location(thead, file$h, 12, 6, 356);
    			attr_dev(tbody, "class", "svelte-1ecr5l5");
    			add_location(tbody, file$h, 19, 6, 511);
    			attr_dev(table, "class", "svelte-1ecr5l5");
    			add_location(table, file$h, 11, 4, 341);
    			attr_dev(div0, "class", "table-wrapper svelte-1ecr5l5");
    			add_location(div0, file$h, 10, 2, 308);
    			attr_dev(div1, "class", "table-container svelte-1ecr5l5");
    			add_location(div1, file$h, 9, 0, 275);
    			attr_dev(div2, "class", "footer svelte-1ecr5l5");
    			set_style(div2, "min-height", "35rem");
    			set_style(div2, "overflow", "hidden");
    			add_location(div2, file$h, 33, 0, 945);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			insert_dev(target, t8, anchor);
    			insert_dev(target, div2, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*loading*/ 1) {
    				each_value = /*loading*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$7(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$7(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TableLoading', slots, []);
    	let page = 1;
    	const loading = [555, 450, 530, 528, 562, 524, 500, 500, 500, 500];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TableLoading> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Skeleton,
    		LightPaginationNav,
    		page,
    		loading
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) page = $$props.page;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading];
    }

    class TableLoading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TableLoading",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    const col = [
      { id: 'title', label: 'TITLE' },
      { id: 'client-location', label: 'CLIENT LOCATION' },
      { id: 'product', label: 'PRODUCT OR SERVICE' },
      { id: 'campaign', label: 'CAMPAIGN' },
      { id: 'link', label: 'WEB PAGE' },
      { id: 'linkUnlocked', label: 'WEB PAGE - UNLOCKED' },
      { id: 'pdf', label: 'PDF' },
      { id: 'clientHQ', label: 'CLIENT HQ' },
      { id: 'target-location', label: 'TARGET LOCATION' },
      { id: 'target-industry', label: 'TARGET INDUSTRY' },
      { id: 'target-dm', label: 'TARGET DM' },
      { id: 'results', label: 'RESULTS' },
    ];

    const selects = [
      {
        n: 3,
        id: 'client-location',
        label: 'Client Location',
      },

      {
        n: 2,
        id: 'client-industry',
        label: 'Product or Service',
      },
      {
        n: 3,
        id: 'client-hq',
        label: 'CF Client HQ',
      },
      {
        n: 4,
        id: 'target-location',
        label: 'CS Target Location',
      },
      {
        n: 5,
        id: 'target-industry',
        label: 'CS Target Industry',
      },
      {
        n: 6,
        id: 'target-dm',
        label: 'CS Target DM',
      },
    ];

    /* src\components\modal\Popup.svelte generated by Svelte v3.47.0 */

    const { console: console_1$3 } = globals;
    const file$g = "src\\components\\modal\\Popup.svelte";

    function get_each_context$6(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i].id;
    	child_ctx[7] = list[i].label;
    	return child_ctx;
    }

    // (25:2) {#each col as { id, label }
    function create_each_block$6(key_1, ctx) {
    	let li;
    	let div;
    	let input;
    	let t0;
    	let label;
    	let t1_value = /*label*/ ctx[7] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "class", "checkbox-svelte svelte-1o5za8y");
    			attr_dev(input, "type", "checkbox");
    			input.__value = /*id*/ ctx[6];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[2][0].push(input);
    			add_location(input, file$g, 27, 8, 660);
    			attr_dev(label, "class", "checkbox-label svelte-1o5za8y");
    			attr_dev(label, "for", /*id*/ ctx[6]);
    			add_location(label, file$g, 34, 8, 857);
    			attr_dev(div, "class", "filters svelte-1o5za8y");
    			add_location(div, file$g, 26, 6, 629);
    			attr_dev(li, "class", "check-svelte");
    			add_location(li, file$g, 25, 4, 596);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, input);
    			input.checked = ~/*$cols*/ ctx[0].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$cols*/ 1) {
    				input.checked = ~/*$cols*/ ctx[0].indexOf(input.__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			/*$$binding_groups*/ ctx[2][0].splice(/*$$binding_groups*/ ctx[2][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$6.name,
    		type: "each",
    		source: "(25:2) {#each col as { id, label }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let h2;
    	let t1;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = col;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[6];
    	validate_each_keys(ctx, each_value, get_each_context$6, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$6(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$6(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Select What Column you want to display";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$g, 22, 0, 476);
    			attr_dev(ul, "class", "checbox-filters svelte-1o5za8y");
    			add_location(ul, file$g, 23, 0, 525);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*col, $cols*/ 1) {
    				each_value = col;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$6, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, destroy_block, create_each_block$6, null, get_each_context$6);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $cols;
    	let $MoreField;
    	let $isSearching;
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(0, $cols = $$value));
    	validate_store(MoreField, 'MoreField');
    	component_subscribe($$self, MoreField, $$value => $$invalidate(3, $MoreField = $$value));
    	validate_store(isSearching, 'isSearching');
    	component_subscribe($$self, isSearching, $$value => $$invalidate(4, $isSearching = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Popup', slots, []);

    	function handleOnSubmit() {
    		set_store_value(isSearching, $isSearching = false, $isSearching);
    		set_store_value(MoreField, $MoreField = true, $MoreField);
    		cols.set($cols);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Popup> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		$cols = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		cols.set($cols);
    	}

    	$$self.$capture_state = () => ({
    		col,
    		isSearching,
    		SearchTerm,
    		fields,
    		cols,
    		seecol,
    		MoreField,
    		selects,
    		handleOnSubmit,
    		$cols,
    		$MoreField,
    		$isSearching
    	});

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$cols*/ 1) {
    			console.log($cols);
    		}
    	};

    	return [$cols, input_change_handler, $$binding_groups];
    }

    class Popup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Popup",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\Result.svelte generated by Svelte v3.47.0 */
    const file$f = "src\\components\\Result.svelte";

    // (56:0) {#if $fieldID > 0}
    function create_if_block_3$4(ctx) {
    	let modal_1;
    	let current;

    	modal_1 = new Modal$1({
    			props: {
    				show: /*modal*/ ctx[8].set(bind$1(ViewResult))
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal_1, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(56:0) {#if $fieldID > 0}",
    		ctx
    	});

    	return block;
    }

    // (61:4) <Modal show={$modal}>
    function create_default_slot$6(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t0;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Edit Columns";
    			attr_dev(path, "d", "M9 39H11.2L35.45 14.75L34.35 13.65L33.25 12.55L9 36.8ZM6 42V35.6L35.4 6.2Q36.25 5.35 37.525 5.375Q38.8 5.4 39.65 6.25L41.8 8.4Q42.65 9.25 42.65 10.5Q42.65 11.75 41.8 12.6L12.4 42ZM39.5 10.45 37.45 8.4ZM35.45 14.75 34.35 13.65 33.25 12.55 35.45 14.75Z");
    			add_location(path, file$f, 68, 11, 1925);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#014e89");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "width", "35");
    			attr_dev(svg, "viewBox", "-5 7 55 35");
    			add_location(svg, file$f, 62, 8, 1759);
    			attr_dev(span, "class", "modal-text svelte-n701c6");
    			add_location(span, file$f, 72, 8, 2238);
    			attr_dev(button, "class", "modal-button svelte-n701c6");
    			add_location(button, file$f, 61, 6, 1699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(button, t0);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showModal*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(61:4) <Modal show={$modal}>",
    		ctx
    	});

    	return block;
    }

    // (95:33) 
    function create_if_block_2$7(ctx) {
    	let h2;
    	let t1;
    	let div1;
    	let div0;
    	let table;
    	let t2;
    	let div2;
    	let lightpaginationnav;
    	let current;
    	let mounted;
    	let dispose;

    	table = new Table({
    			props: {
    				tableData: /*data*/ ctx[18],
    				tableheaderData: col,
    				tableheader: /*$cols*/ ctx[6]
    			},
    			$$inline: true
    		});

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: /*data*/ ctx[18][0].total,
    				pageSize: 10,
    				currentPage: /*$pages*/ ctx[0],
    				limit: 1
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", /*setPage_handler*/ ctx[13]);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Case Studies";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(table.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(lightpaginationnav.$$.fragment);
    			attr_dev(h2, "class", "table-label svelte-n701c6");
    			add_location(h2, file$f, 95, 12, 2994);
    			attr_dev(div0, "class", "table-wrapper svelte-n701c6");
    			toggle_class(div0, "tableScrolled", /*yTop*/ ctx[2] > 50);
    			add_location(div0, file$f, 97, 14, 3094);
    			attr_dev(div1, "class", "table-container svelte-n701c6");
    			add_location(div1, file$f, 96, 12, 3049);
    			attr_dev(div2, "class", "area-2 svelte-n701c6");
    			add_location(div2, file$f, 114, 12, 3622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(table, div0, null);
    			/*div0_binding_1*/ ctx[12](div0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(lightpaginationnav, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "scroll", /*parseScroll*/ ctx[9], false, false, false),
    					listen_dev(div0, "mousemove", /*parseScroll*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};
    			if (dirty & /*data*/ 262144) table_changes.tableData = /*data*/ ctx[18];
    			if (dirty & /*$cols*/ 64) table_changes.tableheader = /*$cols*/ ctx[6];
    			table.$set(table_changes);

    			if (dirty & /*yTop*/ 4) {
    				toggle_class(div0, "tableScrolled", /*yTop*/ ctx[2] > 50);
    			}

    			const lightpaginationnav_changes = {};
    			if (dirty & /*data*/ 262144) lightpaginationnav_changes.totalItems = /*data*/ ctx[18][0].total;
    			if (dirty & /*$pages*/ 1) lightpaginationnav_changes.currentPage = /*$pages*/ ctx[0];
    			lightpaginationnav.$set(lightpaginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(table);
    			/*div0_binding_1*/ ctx[12](null);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			destroy_component(lightpaginationnav);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(95:33) ",
    		ctx
    	});

    	return block;
    }

    // (93:28) 
    function create_if_block_1$8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Error";
    			add_location(span, file$f, 93, 12, 2927);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(93:28) ",
    		ctx
    	});

    	return block;
    }

    // (81:10) {#if isFetching}
    function create_if_block$8(ctx) {
    	let div1;
    	let div0;
    	let tableloading;
    	let current;
    	let mounted;
    	let dispose;
    	tableloading = new TableLoading({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(tableloading.$$.fragment);
    			attr_dev(div0, "class", "table-wrapper svelte-n701c6");
    			toggle_class(div0, "tableScrolled", /*yTop*/ ctx[2] > 45);
    			add_location(div0, file$f, 82, 14, 2580);
    			attr_dev(div1, "class", "loading svelte-n701c6");
    			add_location(div1, file$f, 81, 12, 2543);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(tableloading, div0, null);
    			/*div0_binding*/ ctx[11](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "scroll", /*parseScroll*/ ctx[9], false, false, false),
    					listen_dev(div0, "mousemove", /*parseScroll*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yTop*/ 4) {
    				toggle_class(div0, "tableScrolled", /*yTop*/ ctx[2] > 45);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tableloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tableloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(tableloading);
    			/*div0_binding*/ ctx[11](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(81:10) {#if isFetching}",
    		ctx
    	});

    	return block;
    }

    // (78:4) 
    function create_query_slot$5(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$8, create_if_block_1$8, create_if_block_2$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isFetching*/ ctx[19]) return 0;
    		if (/*isError*/ ctx[20]) return 1;
    		if (/*data*/ ctx[18]?.length) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "results svelte-fhxlyi");
    			add_location(div0, file$f, 79, 8, 2466);
    			attr_dev(div1, "class", "cntnr");
    			add_location(div1, file$f, 78, 6, 2437);
    			attr_dev(div2, "slot", "query");
    			add_location(div2, file$f, 77, 4, 2363);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_query_slot$5.name,
    		type: "slot",
    		source: "(78:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let modal_1;
    	let t1;
    	let query;
    	let current;
    	let if_block = /*$fieldID*/ ctx[4] > 0 && create_if_block_3$4(ctx);

    	modal_1 = new Modal$1({
    			props: {
    				show: /*$modal*/ ctx[5],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	query = new Query$1({
    			props: {
    				options: /*queryOptions*/ ctx[3],
    				$$slots: {
    					query: [
    						create_query_slot$5,
    						({ queryResult: { data, isFetching, isError } }) => ({ 18: data, 19: isFetching, 20: isError }),
    						({ queryResult: data_data_isFetching_isFetching_isError_isError }) => (data_data_isFetching_isFetching_isError_isError
    						? 262144
    						: 0) | (data_data_isFetching_isFetching_isError_isError
    						? 524288
    						: 0) | (data_data_isFetching_isFetching_isError_isError
    						? 1048576
    						: 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(modal_1.$$.fragment);
    			t1 = space();
    			create_component(query.$$.fragment);
    			attr_dev(div0, "id", "selection");
    			attr_dev(div0, "class", "modal svelte-n701c6");
    			add_location(div0, file$f, 59, 2, 1630);
    			attr_dev(div1, "class", "top-wrapper svelte-n701c6");
    			add_location(div1, file$f, 58, 0, 1601);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(modal_1, div0, null);
    			append_dev(div1, t1);
    			mount_component(query, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$fieldID*/ ctx[4] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$fieldID*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const modal_1_changes = {};
    			if (dirty & /*$modal*/ 32) modal_1_changes.show = /*$modal*/ ctx[5];

    			if (dirty & /*$$scope*/ 2097152) {
    				modal_1_changes.$$scope = { dirty, ctx };
    			}

    			modal_1.$set(modal_1_changes);
    			const query_changes = {};
    			if (dirty & /*queryOptions*/ 8) query_changes.options = /*queryOptions*/ ctx[3];

    			if (dirty & /*$$scope, box, yTop, isFetching, isError, data, $pages, $cols*/ 3932231) {
    				query_changes.$$scope = { dirty, ctx };
    			}

    			query.$set(query_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(modal_1.$$.fragment, local);
    			transition_in(query.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(modal_1.$$.fragment, local);
    			transition_out(query.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(modal_1);
    			destroy_component(query);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let page;
    	let queryOptions;
    	let $pages;
    	let $fieldID;
    	let $modal;
    	let $cols;
    	validate_store(pages, 'pages');
    	component_subscribe($$self, pages, $$value => $$invalidate(0, $pages = $$value));
    	validate_store(fieldID, 'fieldID');
    	component_subscribe($$self, fieldID, $$value => $$invalidate(4, $fieldID = $$value));
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(6, $cols = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Result', slots, []);
    	const showModal = () => modal.set(bind$1(Popup));
    	const modal = writable(null);
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, value => $$invalidate(5, $modal = value));
    	const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;

    	async function fetchPosts(page) {
    		// const data = await fetch(
    		//   `${url}?s=tech&page=${page}&per_page=10&fields=${[5]}`
    		// ).then((res) => res.json());
    		// console.log(data);
    		// return data;
    		const res = await fetch(`${url}?s=tech&page=${page}&per_page=10&fields=5`);

    		const data = await res.json();
    		return data;
    	}

    	let box;
    	let yTop = 0;
    	let yHeight;
    	let yScroll;

    	function parseScroll() {
    		$$invalidate(2, yTop = box.scrollTop);
    		yHeight = box.clientHeight;
    		yScroll = box.scrollHeight;
    	}

    	onMount(async () => parseScroll());
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Result> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			box = $$value;
    			$$invalidate(1, box);
    		});
    	}

    	function div0_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			box = $$value;
    			$$invalidate(1, box);
    		});
    	}

    	const setPage_handler = e => set_store_value(pages, $pages = e.detail.page, $pages);

    	$$self.$capture_state = () => ({
    		Query: Query$1,
    		Table,
    		LightPaginationNav,
    		TableLoading,
    		cols,
    		pages,
    		fieldID,
    		col,
    		Modal: Modal$1,
    		bind: bind$1,
    		writable,
    		ViewResult,
    		Popup,
    		showModal,
    		modal,
    		url,
    		fetchPosts,
    		onMount,
    		box,
    		yTop,
    		yHeight,
    		yScroll,
    		parseScroll,
    		page,
    		queryOptions,
    		$pages,
    		$fieldID,
    		$modal,
    		$cols
    	});

    	$$self.$inject_state = $$props => {
    		if ('box' in $$props) $$invalidate(1, box = $$props.box);
    		if ('yTop' in $$props) $$invalidate(2, yTop = $$props.yTop);
    		if ('yHeight' in $$props) yHeight = $$props.yHeight;
    		if ('yScroll' in $$props) yScroll = $$props.yScroll;
    		if ('page' in $$props) $$invalidate(10, page = $$props.page);
    		if ('queryOptions' in $$props) $$invalidate(3, queryOptions = $$props.queryOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$pages*/ 1) {
    			$$invalidate(10, page = $pages);
    		}

    		if ($$self.$$.dirty & /*page*/ 1024) {
    			$$invalidate(3, queryOptions = {
    				queryKey: ['posts', page],
    				queryFn: () => fetchPosts(page),
    				keepPreviousData: true,
    				cacheTime: 1000 * 60 * 5,
    				refetchOnWindowFocus: false
    			});
    		}
    	};

    	return [
    		$pages,
    		box,
    		yTop,
    		queryOptions,
    		$fieldID,
    		$modal,
    		$cols,
    		showModal,
    		modal,
    		parseScroll,
    		page,
    		div0_binding,
    		div0_binding_1,
    		setPage_handler
    	];
    }

    class Result extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Result",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\components\modal\Filter.svelte generated by Svelte v3.47.0 */
    const file$e = "src\\components\\modal\\Filter.svelte";

    function get_each_context$5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i].n;
    	child_ctx[8] = list[i].id;
    	child_ctx[9] = list[i].label;
    	return child_ctx;
    }

    // (23:4) {#each selects as { n, id, label }
    function create_each_block$5(key_1, ctx) {
    	let li;
    	let div;
    	let input;
    	let t0;
    	let label;
    	let t1_value = /*label*/ ctx[9] + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(input, "class", "checkbox-svelte svelte-kwnxx0");
    			attr_dev(input, "type", "checkbox");
    			input.__value = /*n*/ ctx[7];
    			input.value = input.__value;
    			/*$$binding_groups*/ ctx[2][0].push(input);
    			add_location(input, file$e, 25, 10, 550);
    			attr_dev(label, "class", "checkbox-label svelte-kwnxx0");
    			attr_dev(label, "for", /*id*/ ctx[8]);
    			add_location(label, file$e, 31, 10, 705);
    			attr_dev(div, "class", "filters svelte-kwnxx0");
    			add_location(div, file$e, 24, 8, 517);
    			attr_dev(li, "class", "check-svelte");
    			add_location(li, file$e, 23, 6, 482);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, input);
    			input.checked = ~/*$fields*/ ctx[0].indexOf(input.__value);
    			append_dev(div, t0);
    			append_dev(div, label);
    			append_dev(label, t1);
    			append_dev(li, t2);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*$fields*/ 1) {
    				input.checked = ~/*$fields*/ ctx[0].indexOf(input.__value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			/*$$binding_groups*/ ctx[2][0].splice(/*$$binding_groups*/ ctx[2][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$5.name,
    		type: "each",
    		source: "(23:4) {#each selects as { n, id, label }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let h2;
    	let t1;
    	let div;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = selects;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[8];
    	validate_each_keys(ctx, each_value, get_each_context$5, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$5(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$5(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Select Filter for Search";
    			t1 = space();
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h2, file$e, 19, 0, 339);
    			attr_dev(ul, "class", "checbox-filters svelte-kwnxx0");
    			add_location(ul, file$e, 21, 2, 400);
    			attr_dev(div, "class", "dropdown");
    			add_location(div, file$e, 20, 0, 374);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selects, $fields*/ 1) {
    				each_value = selects;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$5, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, destroy_block, create_each_block$5, null, get_each_context$5);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $cols;
    	let $MoreField;
    	let $isSearching;
    	let $fields;
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(3, $cols = $$value));
    	validate_store(MoreField, 'MoreField');
    	component_subscribe($$self, MoreField, $$value => $$invalidate(4, $MoreField = $$value));
    	validate_store(isSearching, 'isSearching');
    	component_subscribe($$self, isSearching, $$value => $$invalidate(5, $isSearching = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(0, $fields = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Filter', slots, []);

    	function handleOnSubmit() {
    		set_store_value(isSearching, $isSearching = false, $isSearching);
    		set_store_value(MoreField, $MoreField = true, $MoreField);
    		cols.set($cols);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Filter> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		$fields = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		fields.set($fields);
    	}

    	$$self.$capture_state = () => ({
    		col,
    		isSearching,
    		SearchTerm,
    		fields,
    		cols,
    		seecol,
    		MoreField,
    		selects,
    		handleOnSubmit,
    		$cols,
    		$MoreField,
    		$isSearching,
    		$fields
    	});

    	return [$fields, input_change_handler, $$binding_groups];
    }

    class Filter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Filter",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\components\SearchForm.svelte generated by Svelte v3.47.0 */
    const file$d = "src\\components\\SearchForm.svelte";

    // (18:2) <Modal show={$modal}>
    function create_default_slot$5(ctx) {
    	let button;
    	let div;
    	let svg;
    	let path;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			span = element("span");
    			span.textContent = "Filters";
    			attr_dev(path, "d", "M17.75 28.917V27.917H22.25V28.917ZM6.083 10.417V9.417H33.917V10.417ZM11.083 19.667V18.667H28.917V19.667Z");
    			add_location(path, file$d, 21, 11, 680);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "40");
    			attr_dev(svg, "width", "40");
    			add_location(svg, file$d, 20, 8, 605);
    			attr_dev(span, "class", "menulabel svelte-13vlgn8");
    			add_location(span, file$d, 24, 9, 837);
    			attr_dev(div, "class", "menubarlabel svelte-13vlgn8");
    			add_location(div, file$d, 19, 6, 569);
    			attr_dev(button, "class", "menubar svelte-13vlgn8");
    			attr_dev(button, "aria-label", "Start search");
    			add_location(button, file$d, 18, 4, 490);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			append_dev(div, span);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showModal*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(18:2) <Modal show={$modal}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div0;
    	let t0;
    	let div2;
    	let modal_1;
    	let t1;
    	let form;
    	let div1;
    	let input;
    	let t2;
    	let button;
    	let svg;
    	let path0;
    	let path1;
    	let button_disabled_value;
    	let current;
    	let mounted;
    	let dispose;

    	modal_1 = new Modal$1({
    			props: {
    				show: /*$modal*/ ctx[0],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			div2 = element("div");
    			create_component(modal_1.$$.fragment);
    			t1 = space();
    			form = element("form");
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(div0, "class", "wrapper-spacer");
    			add_location(div0, file$d, 15, 0, 402);
    			attr_dev(input, "class", "searchBox svelte-iqmikt svelte-13vlgn8");
    			attr_dev(input, "type", "search");
    			attr_dev(input, "name", "search");
    			attr_dev(input, "spellcheck", "true");
    			attr_dev(input, "placeholder", "Type keywords to find case studies");
    			attr_dev(input, "aria-label", "Search case studies");
    			input.required = true;
    			add_location(input, file$d, 30, 6, 1030);
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$d, 54, 11, 1699);
    			attr_dev(path1, "d", "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z");
    			add_location(path1, file$d, 54, 49, 1737);
    			attr_dev(svg, "class", "icon svelte-13vlgn8");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "black");
    			attr_dev(svg, "width", "24px");
    			attr_dev(svg, "height", "24px");
    			add_location(svg, file$d, 47, 9, 1508);
    			attr_dev(button, "class", "button svelte-iqmikt svelte-13vlgn8");
    			button.disabled = button_disabled_value = /*$SearchTerm*/ ctx[1] === '';
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "aria-label", "Start search");
    			attr_dev(button, "title", "Click to search");
    			add_location(button, file$d, 41, 6, 1322);
    			attr_dev(div1, "class", "wrapper svelte-iqmikt svelte-13vlgn8");
    			add_location(div1, file$d, 29, 4, 987);
    			attr_dev(form, "class", "form svelte-13vlgn8");
    			add_location(form, file$d, 28, 2, 920);
    			attr_dev(div2, "class", "wrapper-bar svelte-13vlgn8");
    			add_location(div2, file$d, 16, 0, 434);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(modal_1, div2, null);
    			append_dev(div2, t1);
    			append_dev(div2, form);
    			append_dev(form, div1);
    			append_dev(div1, input);
    			set_input_value(input, /*$SearchTerm*/ ctx[1]);
    			append_dev(div1, t2);
    			append_dev(div1, button);
    			append_dev(button, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*handleOnSubmit*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const modal_1_changes = {};
    			if (dirty & /*$modal*/ 1) modal_1_changes.show = /*$modal*/ ctx[0];

    			if (dirty & /*$$scope*/ 256) {
    				modal_1_changes.$$scope = { dirty, ctx };
    			}

    			modal_1.$set(modal_1_changes);

    			if (dirty & /*$SearchTerm*/ 2) {
    				set_input_value(input, /*$SearchTerm*/ ctx[1]);
    			}

    			if (!current || dirty & /*$SearchTerm*/ 2 && button_disabled_value !== (button_disabled_value = /*$SearchTerm*/ ctx[1] === '')) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			destroy_component(modal_1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $fields;
    	let $isSearching;
    	let $modal;
    	let $SearchTerm;
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(6, $fields = $$value));
    	validate_store(isSearching, 'isSearching');
    	component_subscribe($$self, isSearching, $$value => $$invalidate(7, $isSearching = $$value));
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(1, $SearchTerm = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchForm', slots, []);

    	function handleOnSubmit() {
    		set_store_value(isSearching, $isSearching = true, $isSearching);
    		fields.set($fields);
    	}

    	const modal = writable(null);
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, value => $$invalidate(0, $modal = value));
    	const showModal = () => modal.set(bind$1(Filter));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchForm> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		$SearchTerm = this.value;
    		SearchTerm.set($SearchTerm);
    	}

    	$$self.$capture_state = () => ({
    		isSearching,
    		SearchTerm,
    		fields,
    		handleOnSubmit,
    		Modal: Modal$1,
    		bind: bind$1,
    		writable,
    		Filter,
    		modal,
    		showModal,
    		$fields,
    		$isSearching,
    		$modal,
    		$SearchTerm
    	});

    	return [$modal, $SearchTerm, handleOnSubmit, modal, showModal, input_input_handler];
    }

    class SearchForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchForm",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\components\Selection.svelte generated by Svelte v3.47.0 */

    const { console: console_1$2 } = globals;
    const file$c = "src\\components\\Selection.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i].n;
    	child_ctx[12] = list[i].label;
    	child_ctx[13] = list[i].id;
    	return child_ctx;
    }

    // (41:6) {:else}
    function create_else_block$6(ctx) {
    	let select;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let mounted;
    	let dispose;
    	let each_value = /*queryResult*/ ctx[10].data;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[13];
    	validate_each_keys(ctx, each_value, get_each_context$4, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$4(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$4(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "class", "rc-select svelte-q3fbkk");
    			if (/*$selection*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[6].call(select));
    			add_location(select, file$c, 41, 8, 1137);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*$selection*/ ctx[1]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[6]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*queryResult*/ 1024) {
    				each_value = /*queryResult*/ ctx[10].data;
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$4, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, select, destroy_block, create_each_block$4, null, get_each_context$4);
    			}

    			if (dirty & /*$selection, queryResult*/ 1026) {
    				select_option(select, /*$selection*/ ctx[1]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(41:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:36) 
    function create_if_block_1$7(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Error";
    			add_location(span, file$c, 39, 8, 1094);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(39:36) ",
    		ctx
    	});

    	return block;
    }

    // (37:6) {#if queryResult.isFetching}
    function create_if_block$7(ctx) {
    	let skeleton;
    	let current;

    	skeleton = new Skeleton({
    			props: { height: "42", width: "180" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(skeleton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(skeleton, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skeleton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skeleton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(skeleton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(37:6) {#if queryResult.isFetching}",
    		ctx
    	});

    	return block;
    }

    // (43:10) {#each queryResult.data as { n, label, id }
    function create_each_block$4(key_1, ctx) {
    	let option;
    	let t0_value = /*label*/ ctx[12] + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*n*/ ctx[11];
    			option.value = option.__value;
    			add_location(option, file$c, 43, 12, 1262);
    			this.first = option;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*queryResult*/ 1024 && t0_value !== (t0_value = /*label*/ ctx[12] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*queryResult*/ 1024 && option_value_value !== (option_value_value = /*n*/ ctx[11])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(43:10) {#each queryResult.data as { n, label, id }",
    		ctx
    	});

    	return block;
    }

    // (35:2) 
    function create_query_slot$4(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$7, create_if_block_1$7, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*queryResult*/ ctx[10].isFetching) return 0;
    		if (/*queryResult*/ ctx[10].isError) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "wrapper svelte-q3fbkk");
    			add_location(div0, file$c, 35, 4, 943);
    			attr_dev(div1, "slot", "query");
    			add_location(div1, file$c, 34, 2, 903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_query_slot$4.name,
    		type: "slot",
    		source: "(35:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let query;
    	let current;

    	query = new Query$1({
    			props: {
    				options: /*queryOptions*/ ctx[0],
    				$$slots: {
    					query: [
    						create_query_slot$4,
    						({ queryResult }) => ({ 10: queryResult }),
    						({ queryResult }) => queryResult ? 1024 : 0
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(query.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(query, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const query_changes = {};
    			if (dirty & /*queryOptions*/ 1) query_changes.options = /*queryOptions*/ ctx[0];

    			if (dirty & /*$$scope, queryResult, $selection*/ 66562) {
    				query_changes.$$scope = { dirty, ctx };
    			}

    			query.$set(query_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(query.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(query.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(query, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let field;
    	let queryOptions;
    	let $SearchTerm;
    	let $selection;
    	let $fields;
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(4, $SearchTerm = $$value));
    	validate_store(selection, 'selection');
    	component_subscribe($$self, selection, $$value => $$invalidate(1, $selection = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(5, $fields = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Selection', slots, []);
    	let page = 1;
    	let s;
    	const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;

    	async function fetchPosts({ page = 1, s, field }) {
    		const res = await fetch(`${url}?s=${s}&page=${page}&per_page=10&fields=${field.join(',')}`);
    		const data = await res.json();
    		set_store_value(selection, $selection = data[0].n, $selection);
    		return data;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Selection> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		$selection = select_value(this);
    		selection.set($selection);
    		$$invalidate(10, queryResult);
    	}

    	$$self.$capture_state = () => ({
    		Query: Query$1,
    		Skeleton,
    		SearchTerm,
    		selection,
    		fields,
    		page,
    		s,
    		url,
    		fetchPosts,
    		field,
    		queryOptions,
    		$SearchTerm,
    		$selection,
    		$fields
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(7, page = $$props.page);
    		if ('s' in $$props) $$invalidate(2, s = $$props.s);
    		if ('field' in $$props) $$invalidate(3, field = $$props.field);
    		if ('queryOptions' in $$props) $$invalidate(0, queryOptions = $$props.queryOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$SearchTerm*/ 16) {
    			$$invalidate(2, s = $SearchTerm.toLowerCase());
    		}

    		if ($$self.$$.dirty & /*$fields*/ 32) {
    			$$invalidate(3, field = $fields);
    		}

    		if ($$self.$$.dirty & /*s*/ 4) {
    			console.log(s.len);
    		}

    		if ($$self.$$.dirty & /*s, field, $SearchTerm*/ 28) {
    			$$invalidate(0, queryOptions = {
    				queryKey: ['seeMore', page, s, field],
    				queryFn: () => fetchPosts({ page, s, field }),
    				enabled: $SearchTerm !== '',
    				keepPreviousData: true,
    				cacheTime: 1000 * 60 * 5
    			});
    		}
    	};

    	return [
    		queryOptions,
    		$selection,
    		s,
    		field,
    		$SearchTerm,
    		$fields,
    		select_change_handler
    	];
    }

    class Selection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selection",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\FieldResultLoading.svelte generated by Svelte v3.47.0 */
    const file$b = "src\\components\\FieldResultLoading.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (24:12) {#each loading as load}
    function create_each_block$3(ctx) {
    	let tr;
    	let td0;
    	let skeleton0;
    	let t0;
    	let td1;
    	let skeleton1;
    	let t1;
    	let td2;
    	let skeleton2;
    	let t2;
    	let current;

    	skeleton0 = new Skeleton({
    			props: { height: "18", width: /*load*/ ctx[2] },
    			$$inline: true
    		});

    	skeleton1 = new Skeleton({
    			props: { height: "20", width: "80" },
    			$$inline: true
    		});

    	skeleton2 = new Skeleton({
    			props: { height: "40", width: "90" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			td0 = element("td");
    			create_component(skeleton0.$$.fragment);
    			t0 = space();
    			td1 = element("td");
    			create_component(skeleton1.$$.fragment);
    			t1 = space();
    			td2 = element("td");
    			create_component(skeleton2.$$.fragment);
    			t2 = space();
    			attr_dev(td0, "class", "svelte-1vuwmo1");
    			add_location(td0, file$b, 25, 16, 746);
    			attr_dev(td1, "class", "table-td svelte-1vuwmo1");
    			add_location(td1, file$b, 26, 16, 811);
    			attr_dev(td2, "class", "table-td svelte-1vuwmo1");
    			add_location(td2, file$b, 27, 16, 891);
    			attr_dev(tr, "class", "svelte-1vuwmo1");
    			add_location(tr, file$b, 24, 14, 724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td0);
    			mount_component(skeleton0, td0, null);
    			append_dev(tr, t0);
    			append_dev(tr, td1);
    			mount_component(skeleton1, td1, null);
    			append_dev(tr, t1);
    			append_dev(tr, td2);
    			mount_component(skeleton2, td2, null);
    			append_dev(tr, t2);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(skeleton0.$$.fragment, local);
    			transition_in(skeleton1.$$.fragment, local);
    			transition_in(skeleton2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(skeleton0.$$.fragment, local);
    			transition_out(skeleton1.$$.fragment, local);
    			transition_out(skeleton2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_component(skeleton0);
    			destroy_component(skeleton1);
    			destroy_component(skeleton2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(24:12) {#each loading as load}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div4;
    	let div3;
    	let h2;
    	let t1;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let t3;
    	let th1;
    	let t5;
    	let th2;
    	let t7;
    	let tbody;
    	let t8;
    	let div2;
    	let lightpaginationnav;
    	let current;
    	let each_value = /*loading*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: 20,
    				pageSize: 10,
    				currentPage: 1,
    				limit: 1
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", 1);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Case Studies";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Title";
    			t3 = space();
    			th1 = element("th");
    			th1.textContent = "PRODUCT OR SERVICE";
    			t5 = space();
    			th2 = element("th");
    			th2.textContent = "PDF";
    			t7 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div2 = element("div");
    			create_component(lightpaginationnav.$$.fragment);
    			attr_dev(h2, "class", "table-label svelte-1vuwmo1");
    			add_location(h2, file$b, 10, 4, 282);
    			attr_dev(th0, "class", "svelte-1vuwmo1");
    			add_location(th0, file$b, 16, 14, 463);
    			attr_dev(th1, "class", "svelte-1vuwmo1");
    			add_location(th1, file$b, 17, 14, 495);
    			attr_dev(th2, "class", "svelte-1vuwmo1");
    			add_location(th2, file$b, 18, 14, 540);
    			attr_dev(tr, "class", "svelte-1vuwmo1");
    			add_location(tr, file$b, 15, 12, 443);
    			attr_dev(thead, "class", "svelte-1vuwmo1");
    			add_location(thead, file$b, 14, 10, 422);
    			attr_dev(tbody, "class", "svelte-1vuwmo1");
    			add_location(tbody, file$b, 21, 10, 605);
    			attr_dev(table, "class", "svelte-1vuwmo1");
    			add_location(table, file$b, 13, 8, 403);
    			attr_dev(div0, "class", "table-wrapper svelte-1vuwmo1");
    			add_location(div0, file$b, 12, 6, 366);
    			attr_dev(div1, "class", "table-container svelte-1vuwmo1");
    			add_location(div1, file$b, 11, 4, 329);
    			attr_dev(div2, "class", "area-2");
    			add_location(div2, file$b, 35, 4, 1095);
    			attr_dev(div3, "class", "results svelte-1vuwmo1");
    			add_location(div3, file$b, 9, 2, 255);
    			attr_dev(div4, "class", "cntnr");
    			add_location(div4, file$b, 8, 0, 232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, h2);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, t3);
    			append_dev(tr, th1);
    			append_dev(tr, t5);
    			append_dev(tr, th2);
    			append_dev(table, t7);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(div3, t8);
    			append_dev(div3, div2);
    			mount_component(lightpaginationnav, div2, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*loading*/ 1) {
    				each_value = /*loading*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_each(each_blocks, detaching);
    			destroy_component(lightpaginationnav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FieldResultLoading', slots, []);
    	let page = 1;
    	const loading = [555, 450, 530, 528, 562, 524, 500, 500, 500, 500];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<FieldResultLoading> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Skeleton,
    		LightPaginationNav,
    		page,
    		loading
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) page = $$props.page;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading];
    }

    class FieldResultLoading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldResultLoading",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\FieldResult.svelte generated by Svelte v3.47.0 */

    const { console: console_1$1 } = globals;
    const file$a = "src\\components\\FieldResult.svelte";

    // (90:0) {#if $fieldID > 0}
    function create_if_block_4$2(ctx) {
    	let modal_1;
    	let current;

    	modal_1 = new Modal$1({
    			props: {
    				show: /*modal*/ ctx[9].set(bind$1(ViewResult))
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal_1, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(90:0) {#if $fieldID > 0}",
    		ctx
    	});

    	return block;
    }

    // (99:6) <Modal show={$modal}>
    function create_default_slot$4(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t0;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Edit Columns";
    			attr_dev(path, "d", "M9 39H11.2L35.45 14.75L34.35 13.65L33.25 12.55L9 36.8ZM6 42V35.6L35.4 6.2Q36.25 5.35 37.525 5.375Q38.8 5.4 39.65 6.25L41.8 8.4Q42.65 9.25 42.65 10.5Q42.65 11.75 41.8 12.6L12.4 42ZM39.5 10.45 37.45 8.4ZM35.45 14.75 34.35 13.65 33.25 12.55 35.45 14.75Z");
    			add_location(path, file$a, 106, 13, 3032);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#014e89");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "width", "35");
    			attr_dev(svg, "viewBox", "-5 7 55 35");
    			add_location(svg, file$a, 100, 10, 2854);
    			attr_dev(span, "class", "modal-text svelte-1xkkjrb");
    			add_location(span, file$a, 110, 10, 3353);
    			attr_dev(button, "class", "modal-button svelte-1xkkjrb");
    			add_location(button, file$a, 99, 8, 2792);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(button, t0);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showModal*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(99:6) <Modal show={$modal}>",
    		ctx
    	});

    	return block;
    }

    // (165:10) {:else}
    function create_else_block$5(ctx) {
    	let noresult;
    	let current;
    	noresult = new NoResult({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(noresult.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(noresult, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(noresult.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(noresult.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(noresult, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(165:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (133:33) 
    function create_if_block_2$6(ctx) {
    	let h20;
    	let t1;
    	let h21;
    	let t2;
    	let t3_value = /*data*/ ctx[21][0].label + "";
    	let t3;
    	let t4;
    	let div1;
    	let div0;
    	let table;
    	let t5;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;

    	table = new Table({
    			props: {
    				tableData: /*data*/ ctx[21],
    				tableheaderData: col,
    				tableheader: /*$cols*/ ctx[7]
    			},
    			$$inline: true
    		});

    	let if_block = /*$selection*/ ctx[0] > 0 && create_if_block_3$3(ctx);

    	const block = {
    		c: function create() {
    			h20 = element("h2");
    			h20.textContent = "Case Studies";
    			t1 = space();
    			h21 = element("h2");
    			t2 = text("By ");
    			t3 = text(t3_value);
    			t4 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(table.$$.fragment);
    			t5 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(h20, "class", "table-label svelte-1xkkjrb");
    			add_location(h20, file$a, 133, 12, 4060);
    			attr_dev(h21, "class", "table-sublabel svelte-1xkkjrb");
    			add_location(h21, file$a, 134, 12, 4115);
    			attr_dev(div0, "class", "table-wrapper svelte-1xkkjrb");
    			toggle_class(div0, "tableScrolled", /*yTop*/ ctx[3] > 50);
    			add_location(div0, file$a, 137, 14, 4226);
    			attr_dev(div1, "class", "table-container svelte-1xkkjrb");
    			add_location(div1, file$a, 136, 12, 4181);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h20, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h21, anchor);
    			append_dev(h21, t2);
    			append_dev(h21, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(table, div0, null);
    			/*div0_binding*/ ctx[17](div0);
    			insert_dev(target, t5, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "scroll", /*parseScroll*/ ctx[10], false, false, false),
    					listen_dev(div0, "mousemove", /*parseScroll*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*data*/ 2097152) && t3_value !== (t3_value = /*data*/ ctx[21][0].label + "")) set_data_dev(t3, t3_value);
    			const table_changes = {};
    			if (dirty & /*data*/ 2097152) table_changes.tableData = /*data*/ ctx[21];
    			if (dirty & /*$cols*/ 128) table_changes.tableheader = /*$cols*/ ctx[7];
    			table.$set(table_changes);

    			if (dirty & /*yTop*/ 8) {
    				toggle_class(div0, "tableScrolled", /*yTop*/ ctx[3] > 50);
    			}

    			if (/*$selection*/ ctx[0] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$selection*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h20);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h21);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			destroy_component(table);
    			/*div0_binding*/ ctx[17](null);
    			if (detaching) detach_dev(t5);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(133:33) ",
    		ctx
    	});

    	return block;
    }

    // (131:28) 
    function create_if_block_1$6(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Error";
    			add_location(span, file$a, 131, 12, 3993);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(131:28) ",
    		ctx
    	});

    	return block;
    }

    // (121:10) {#if isFetching}
    function create_if_block$6(ctx) {
    	let div;
    	let fieldresultloading;
    	let current;
    	let mounted;
    	let dispose;
    	fieldresultloading = new FieldResultLoading({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(fieldresultloading.$$.fragment);
    			attr_dev(div, "class", "table-wrapper svelte-1xkkjrb");
    			toggle_class(div, "tableScrolled", /*yTop*/ ctx[3] > 50);
    			add_location(div, file$a, 121, 12, 3676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(fieldresultloading, div, null);
    			/*div_binding*/ ctx[16](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "scroll", /*parseScroll*/ ctx[10], false, false, false),
    					listen_dev(div, "mousemove", /*parseScroll*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yTop*/ 8) {
    				toggle_class(div, "tableScrolled", /*yTop*/ ctx[3] > 50);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fieldresultloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fieldresultloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(fieldresultloading);
    			/*div_binding*/ ctx[16](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(121:10) {#if isFetching}",
    		ctx
    	});

    	return block;
    }

    // (154:12) {#if $selection > 0}
    function create_if_block_3$3(ctx) {
    	let div;
    	let lightpaginationnav;
    	let current;

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: /*data*/ ctx[21][0].total,
    				pageSize: 10,
    				currentPage: /*$pages*/ ctx[1],
    				limit: 1
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", /*setPage_handler*/ ctx[18]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(lightpaginationnav.$$.fragment);
    			attr_dev(div, "class", "area-2 svelte-1xkkjrb");
    			add_location(div, file$a, 154, 14, 4788);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(lightpaginationnav, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lightpaginationnav_changes = {};
    			if (dirty & /*data*/ 2097152) lightpaginationnav_changes.totalItems = /*data*/ ctx[21][0].total;
    			if (dirty & /*$pages*/ 2) lightpaginationnav_changes.currentPage = /*$pages*/ ctx[1];
    			lightpaginationnav.$set(lightpaginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(lightpaginationnav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(154:12) {#if $selection > 0}",
    		ctx
    	});

    	return block;
    }

    // (118:4) 
    function create_query_slot$3(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$6, create_if_block_1$6, create_if_block_2$6, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isFetching*/ ctx[22]) return 0;
    		if (/*isError*/ ctx[23]) return 1;
    		if (/*data*/ ctx[21]?.length) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "results svelte-fhxlyi");
    			add_location(div0, file$a, 119, 8, 3599);
    			attr_dev(div1, "class", "cntnr svelte-1xkkjrb");
    			add_location(div1, file$a, 118, 6, 3570);
    			attr_dev(div2, "slot", "query");
    			add_location(div2, file$a, 117, 4, 3496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_query_slot$3.name,
    		type: "slot",
    		source: "(118:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let link0;
    	let link1;
    	let link2;
    	let t0;
    	let t1;
    	let div3;
    	let div2;
    	let div0;
    	let selection_1;
    	let t2;
    	let div1;
    	let modal_1;
    	let t3;
    	let query;
    	let current;
    	let if_block = /*$fieldID*/ ctx[5] > 0 && create_if_block_4$2(ctx);
    	selection_1 = new Selection({ $$inline: true });

    	modal_1 = new Modal$1({
    			props: {
    				show: /*$modal*/ ctx[6],
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	query = new Query$1({
    			props: {
    				options: /*queryOptions*/ ctx[4],
    				$$slots: {
    					query: [
    						create_query_slot$3,
    						({ queryResult: { data, isFetching, isError } }) => ({ 21: data, 22: isFetching, 23: isError }),
    						({ queryResult: data_data_isFetching_isFetching_isError_isError }) => (data_data_isFetching_isFetching_isError_isError
    						? 2097152
    						: 0) | (data_data_isFetching_isFetching_isError_isError
    						? 4194304
    						: 0) | (data_data_isFetching_isFetching_isError_isError
    						? 8388608
    						: 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			link2 = element("link");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(selection_1.$$.fragment);
    			t2 = space();
    			div1 = element("div");
    			create_component(modal_1.$$.fragment);
    			t3 = space();
    			create_component(query.$$.fragment);
    			attr_dev(link0, "rel", "preconnect");
    			attr_dev(link0, "href", "https://fonts.googleapis.com");
    			add_location(link0, file$a, 71, 2, 2017);
    			attr_dev(link1, "rel", "preconnect");
    			attr_dev(link1, "href", "https://fonts.gstatic.com");
    			attr_dev(link1, "crossorigin", "");
    			add_location(link1, file$a, 72, 2, 2082);
    			attr_dev(link2, "href", "https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;700&display=swap");
    			attr_dev(link2, "rel", "stylesheet");
    			add_location(link2, file$a, 73, 2, 2156);
    			attr_dev(div0, "class", "modal svelte-1xkkjrb");
    			add_location(div0, file$a, 94, 4, 2664);
    			attr_dev(div1, "class", "dropdwn-selection svelte-1xkkjrb");
    			add_location(div1, file$a, 97, 4, 2722);
    			attr_dev(div2, "class", "modal-wrapper svelte-1xkkjrb");
    			add_location(div2, file$a, 93, 2, 2631);
    			attr_dev(div3, "class", "top-wrapper svelte-1xkkjrb");
    			add_location(div3, file$a, 92, 0, 2602);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link0);
    			append_dev(document.head, link1);
    			append_dev(document.head, link2);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(selection_1, div0, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			mount_component(modal_1, div1, null);
    			append_dev(div3, t3);
    			mount_component(query, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$fieldID*/ ctx[5] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$fieldID*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_4$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const modal_1_changes = {};
    			if (dirty & /*$modal*/ 64) modal_1_changes.show = /*$modal*/ ctx[6];

    			if (dirty & /*$$scope*/ 16777216) {
    				modal_1_changes.$$scope = { dirty, ctx };
    			}

    			modal_1.$set(modal_1_changes);
    			const query_changes = {};
    			if (dirty & /*queryOptions*/ 16) query_changes.options = /*queryOptions*/ ctx[4];

    			if (dirty & /*$$scope, box, yTop, isFetching, isError, data, $pages, $selection, $cols*/ 31457423) {
    				query_changes.$$scope = { dirty, ctx };
    			}

    			query.$set(query_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(selection_1.$$.fragment, local);
    			transition_in(modal_1.$$.fragment, local);
    			transition_in(query.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(selection_1.$$.fragment, local);
    			transition_out(modal_1.$$.fragment, local);
    			transition_out(query.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link0);
    			detach_dev(link1);
    			detach_dev(link2);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div3);
    			destroy_component(selection_1);
    			destroy_component(modal_1);
    			destroy_component(query);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let field;
    	let queryOptions;
    	let $SearchTerm;
    	let $selection;
    	let $fields;
    	let $pages;
    	let $fieldID;
    	let $modal;
    	let $cols;
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(14, $SearchTerm = $$value));
    	validate_store(selection, 'selection');
    	component_subscribe($$self, selection, $$value => $$invalidate(0, $selection = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(15, $fields = $$value));
    	validate_store(pages, 'pages');
    	component_subscribe($$self, pages, $$value => $$invalidate(1, $pages = $$value));
    	validate_store(fieldID, 'fieldID');
    	component_subscribe($$self, fieldID, $$value => $$invalidate(5, $fieldID = $$value));
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(7, $cols = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FieldResult', slots, []);
    	const showModal = () => modal.set(bind$1(Popup));
    	const modal = writable(null);
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, value => $$invalidate(6, $modal = value));
    	let page = 1;
    	let s;
    	const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;

    	async function fetchPosts({ page = 1, s, field, $selection }) {
    		if ($selection > 0) {
    			const res = await fetch(`${url}?s=${s}&page=${page}&per_page=10&fields=${$selection}`);
    			const data = await res.json();
    			console.log(data);
    			return data;
    		} else {
    			const res = await fetch(`${url}?s=${s}&page=${page}&per_page=10&fields=${field.join(',')}`);
    			const data = await res.json();
    			return data;
    		}
    	}

    	let box;
    	let yTop = 0;

    	function parseScroll() {
    		$$invalidate(3, yTop = box.scrollTop);
    		yHeight = box.clientHeight;
    		yScroll = box.scrollHeight;
    	}

    	onMount(async () => parseScroll());
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<FieldResult> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			box = $$value;
    			$$invalidate(2, box);
    		});
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			box = $$value;
    			$$invalidate(2, box);
    		});
    	}

    	const setPage_handler = e => set_store_value(pages, $pages = e.detail.page, $pages);

    	$$self.$capture_state = () => ({
    		Selection,
    		Query: Query$1,
    		SearchTerm,
    		selection,
    		fields,
    		cols,
    		pages,
    		fieldID,
    		col,
    		LightPaginationNav,
    		NoResult,
    		FieldResultLoading,
    		Skeleton,
    		Modal: Modal$1,
    		bind: bind$1,
    		writable,
    		ViewResult,
    		Popup,
    		showModal,
    		modal,
    		page,
    		s,
    		url,
    		fetchPosts,
    		onMount,
    		box,
    		yTop,
    		parseScroll,
    		Table,
    		field,
    		queryOptions,
    		$SearchTerm,
    		$selection,
    		$fields,
    		$pages,
    		$fieldID,
    		$modal,
    		$cols
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(11, page = $$props.page);
    		if ('s' in $$props) $$invalidate(12, s = $$props.s);
    		if ('box' in $$props) $$invalidate(2, box = $$props.box);
    		if ('yTop' in $$props) $$invalidate(3, yTop = $$props.yTop);
    		if ('field' in $$props) $$invalidate(13, field = $$props.field);
    		if ('queryOptions' in $$props) $$invalidate(4, queryOptions = $$props.queryOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$SearchTerm*/ 16384) {
    			$$invalidate(12, s = $SearchTerm.toLowerCase());
    		}

    		if ($$self.$$.dirty & /*$pages*/ 2) {
    			$$invalidate(11, page = $pages);
    		}

    		if ($$self.$$.dirty & /*$fields*/ 32768) {
    			$$invalidate(13, field = $fields);
    		}

    		if ($$self.$$.dirty & /*page, s, field, $selection, $SearchTerm*/ 30721) {
    			$$invalidate(4, queryOptions = {
    				queryKey: ['seeMore', page, s, field, $selection],
    				queryFn: () => fetchPosts({ page, s, field, $selection }),
    				enabled: $SearchTerm !== '',
    				keepPreviousData: true,
    				cacheTime: 1000 * 60 * 5,
    				refetchOnWindowFocus: false
    			});
    		}
    	};

    	return [
    		$selection,
    		$pages,
    		box,
    		yTop,
    		queryOptions,
    		$fieldID,
    		$modal,
    		$cols,
    		showModal,
    		modal,
    		parseScroll,
    		page,
    		s,
    		field,
    		$SearchTerm,
    		$fields,
    		div_binding,
    		div0_binding,
    		setPage_handler
    	];
    }

    class FieldResult extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FieldResult",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\SearchFormClose.svelte generated by Svelte v3.47.0 */

    const file$9 = "src\\components\\SearchFormClose.svelte";

    // (65:8) {:else}
    function create_else_block$4(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text("Results for \"");
    			t1 = text(/*$SearchTerm*/ ctx[3]);
    			t2 = text("\"");
    			attr_dev(div, "class", "resultsFor svelte-17p2yix svelte-156mlfu");
    			add_location(div, file$9, 65, 10, 1821);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$SearchTerm*/ 8) set_data_dev(t1, /*$SearchTerm*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(65:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:29) 
    function create_if_block_2$5(ctx) {
    	let div;
    	let button;
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text("« Back to all results for “");
    			t1 = text(/*$SearchTerm*/ ctx[3]);
    			t2 = text("”");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "link svelte-1yo2ena primary svelte-156mlfu");
    			attr_dev(button, "aria-disabled", "false");
    			add_location(button, file$9, 56, 12, 1523);
    			attr_dev(div, "class", "resultsFor svelte-17p2yix svelte-156mlfu");
    			add_location(div, file$9, 55, 10, 1470);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$SearchTerm*/ 8) set_data_dev(t1, /*$SearchTerm*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(55:29) ",
    		ctx
    	});

    	return block;
    }

    // (45:29) 
    function create_if_block_1$5(ctx) {
    	let div;
    	let button;
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text("« Back to all results for “");
    			t1 = text(/*$SearchTerm*/ ctx[3]);
    			t2 = text("”");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "link svelte-1yo2ena primary svelte-156mlfu");
    			attr_dev(button, "aria-disabled", "false");
    			add_location(button, file$9, 46, 12, 1158);
    			attr_dev(div, "class", "resultsFor svelte-17p2yix svelte-156mlfu");
    			add_location(div, file$9, 45, 10, 1105);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$SearchTerm*/ 8) set_data_dev(t1, /*$SearchTerm*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(45:29) ",
    		ctx
    	});

    	return block;
    }

    // (35:8) {#if $seeMore}
    function create_if_block$5(ctx) {
    	let div;
    	let button;
    	let t0;
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text("« Back to all results for “");
    			t1 = text(/*$SearchTerm*/ ctx[3]);
    			t2 = text("”");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "link svelte-1yo2ena primary svelte-156mlfu");
    			attr_dev(button, "aria-disabled", "false");
    			add_location(button, file$9, 36, 12, 797);
    			attr_dev(div, "class", "resultsFor svelte-17p2yix svelte-156mlfu");
    			add_location(div, file$9, 35, 10, 744);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(button, t1);
    			append_dev(button, t2);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$SearchTerm*/ 8) set_data_dev(t1, /*$SearchTerm*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(35:8) {#if $seeMore}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let form;
    	let div2;
    	let div1;
    	let div0;
    	let t;
    	let button;
    	let svg;
    	let path0;
    	let path1;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*$seeMore*/ ctx[2]) return create_if_block$5;
    		if (/*$MoreField*/ ctx[1]) return create_if_block_1$5;
    		if (/*$viewfield*/ ctx[0]) return create_if_block_2$5;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t = space();
    			button = element("button");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$9, 85, 13, 2373);
    			attr_dev(path1, "d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
    			add_location(path1, file$9, 85, 51, 2411);
    			attr_dev(svg, "class", "icon svelte-156mlfu");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "fill", "black");
    			attr_dev(svg, "width", "36px");
    			attr_dev(svg, "height", "36px");
    			add_location(svg, file$9, 78, 10, 2168);
    			attr_dev(button, "class", "close svelte-17p2yix svelte-156mlfu");
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "aria-label", "Start search");
    			attr_dev(button, "title", "Click to search");
    			button.disabled = "";
    			attr_dev(button, "aria-disabled", "true");
    			add_location(button, file$9, 70, 8, 1946);
    			attr_dev(div0, "class", "nav svelte-17p2yix svelte-156mlfu");
    			add_location(div0, file$9, 33, 6, 676);
    			attr_dev(div1, "class", "cntnr svelte-y5n953 svelte-156mlfu");
    			add_location(div1, file$9, 32, 4, 635);
    			attr_dev(div2, "class", "nav-bg svelte-17p2yix svelte-156mlfu");
    			add_location(div2, file$9, 31, 2, 594);
    			add_location(form, file$9, 30, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if_block.m(div0, null);
    			append_dev(div0, t);
    			append_dev(div0, button);
    			append_dev(button, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleOnSubmit*/ ctx[4]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, t);
    				}
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $viewfield;
    	let $MoreField;
    	let $isSearching;
    	let $seeMore;
    	let $fields;
    	let $SearchTerm;
    	validate_store(viewfield, 'viewfield');
    	component_subscribe($$self, viewfield, $$value => $$invalidate(0, $viewfield = $$value));
    	validate_store(MoreField, 'MoreField');
    	component_subscribe($$self, MoreField, $$value => $$invalidate(1, $MoreField = $$value));
    	validate_store(isSearching, 'isSearching');
    	component_subscribe($$self, isSearching, $$value => $$invalidate(10, $isSearching = $$value));
    	validate_store(seeMore, 'seeMore');
    	component_subscribe($$self, seeMore, $$value => $$invalidate(2, $seeMore = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(11, $fields = $$value));
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(3, $SearchTerm = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchFormClose', slots, []);

    	function handleOnSubmit() {
    		set_store_value(isSearching, $isSearching = false, $isSearching);
    		set_store_value(SearchTerm, $SearchTerm = '', $SearchTerm);
    		set_store_value(seeMore, $seeMore = false, $seeMore);
    		set_store_value(fields, $fields = '', $fields);
    		set_store_value(MoreField, $MoreField = false, $MoreField);
    		set_store_value(viewfield, $viewfield = false, $viewfield);
    	}

    	function onClick() {
    		set_store_value(isSearching, $isSearching = true, $isSearching);
    		set_store_value(seeMore, $seeMore = false, $seeMore);
    		set_store_value(viewfield, $viewfield = false, $viewfield);
    	}

    	function handleClick() {
    		set_store_value(isSearching, $isSearching = true, $isSearching);
    		set_store_value(MoreField, $MoreField = false, $MoreField);
    		set_store_value(viewfield, $viewfield = false, $viewfield);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchFormClose> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => onClick();
    	const click_handler_1 = () => handleClick();
    	const click_handler_2 = () => handleClick();

    	$$self.$capture_state = () => ({
    		isSearching,
    		SearchTerm,
    		seeMore,
    		fields,
    		MoreField,
    		viewfield,
    		handleOnSubmit,
    		onClick,
    		handleClick,
    		$viewfield,
    		$MoreField,
    		$isSearching,
    		$seeMore,
    		$fields,
    		$SearchTerm
    	});

    	return [
    		$viewfield,
    		$MoreField,
    		$seeMore,
    		$SearchTerm,
    		handleOnSubmit,
    		onClick,
    		handleClick,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class SearchFormClose extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchFormClose",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* node_modules\svelte-simple-modal\src\Modal.svelte generated by Svelte v3.47.0 */

    const { Object: Object_1, window: window_1 } = globals;
    const file$8 = "node_modules\\svelte-simple-modal\\src\\Modal.svelte";

    // (401:0) {#if Component}
    function create_if_block$4(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let t;
    	let div0;
    	let switch_instance;
    	let div0_class_value;
    	let div1_class_value;
    	let div1_aria_label_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let div2_class_value;
    	let div3_class_value;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*state*/ ctx[1].closeButton && create_if_block_1$4(ctx);
    	var switch_value = /*Component*/ ctx[2];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			div0 = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"));
    			attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			add_location(div0, file$8, 444, 8, 11301);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"));
    			attr_dev(div1, "role", "dialog");
    			attr_dev(div1, "aria-modal", "true");

    			attr_dev(div1, "aria-label", div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null);

    			attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null);
    			attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			add_location(div1, file$8, 416, 6, 10354);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"));
    			attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			add_location(div2, file$8, 410, 4, 10221);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"));
    			attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			add_location(div3, file$8, 401, 2, 9975);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);

    			if (switch_instance) {
    				mount_component(switch_instance, div0, null);
    			}

    			/*div1_binding*/ ctx[48](div1);
    			/*div2_binding*/ ctx[49](div2);
    			/*div3_binding*/ ctx[50](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div1,
    						"introstart",
    						function () {
    							if (is_function(/*onOpen*/ ctx[13])) /*onOpen*/ ctx[13].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outrostart",
    						function () {
    							if (is_function(/*onClose*/ ctx[14])) /*onClose*/ ctx[14].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"introend",
    						function () {
    							if (is_function(/*onOpened*/ ctx[15])) /*onOpened*/ ctx[15].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						div1,
    						"outroend",
    						function () {
    							if (is_function(/*onClosed*/ ctx[16])) /*onClosed*/ ctx[16].apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(div3, "mousedown", /*handleOuterMousedown*/ ctx[20], false, false, false),
    					listen_dev(div3, "mouseup", /*handleOuterMouseup*/ ctx[21], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*state*/ ctx[1].closeButton) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*state*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div1, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (switch_value !== (switch_value = /*Component*/ ctx[2])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div0, null);
    				} else {
    					switch_instance = null;
    				}
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*state*/ ctx[1].classContent) + " svelte-g4wg3a"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty[0] & /*cssContent*/ 512) {
    				attr_dev(div0, "style", /*cssContent*/ ctx[9]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div0, "content", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_class_value !== (div1_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindow) + " svelte-g4wg3a"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_label_value !== (div1_aria_label_value = /*state*/ ctx[1].ariaLabelledBy
    			? null
    			: /*state*/ ctx[1].ariaLabel || null)) {
    				attr_dev(div1, "aria-label", div1_aria_label_value);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*state*/ ctx[1].ariaLabelledBy || null)) {
    				attr_dev(div1, "aria-labelledby", div1_aria_labelledby_value);
    			}

    			if (!current || dirty[0] & /*cssWindow*/ 256) {
    				attr_dev(div1, "style", /*cssWindow*/ ctx[8]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div1, "window", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*state*/ ctx[1].classWindowWrap) + " svelte-g4wg3a"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*cssWindowWrap*/ 128) {
    				attr_dev(div2, "style", /*cssWindowWrap*/ ctx[7]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div2, "wrap", !/*unstyled*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*state*/ 2 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*state*/ ctx[1].classBg) + " svelte-g4wg3a"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (!current || dirty[0] & /*cssBg*/ 64) {
    				attr_dev(div3, "style", /*cssBg*/ ctx[6]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(div3, "bg", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, true);
    				div1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*currentTransitionWindow*/ ctx[12], /*state*/ ctx[1].transitionWindowProps, false);
    			div1_transition.run(0);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*currentTransitionBg*/ ctx[11], /*state*/ ctx[1].transitionBgProps, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block) if_block.d();
    			if (switch_instance) destroy_component(switch_instance);
    			/*div1_binding*/ ctx[48](null);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[49](null);
    			/*div3_binding*/ ctx[50](null);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(401:0) {#if Component}",
    		ctx
    	});

    	return block;
    }

    // (432:8) {#if state.closeButton}
    function create_if_block_1$4(ctx) {
    	let show_if;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$4, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*state*/ 2) show_if = null;
    		if (show_if == null) show_if = !!/*isFunction*/ ctx[17](/*state*/ ctx[1].closeButton);
    		if (show_if) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx, [-1, -1, -1]);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx, dirty);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(432:8) {#if state.closeButton}",
    		ctx
    	});

    	return block;
    }

    // (435:10) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"));
    			attr_dev(button, "aria-label", "Close modal");
    			attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			add_location(button, file$8, 435, 12, 11050);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(/*state*/ ctx[1].classCloseButton) + " svelte-g4wg3a"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty[0] & /*cssCloseButton*/ 1024) {
    				attr_dev(button, "style", /*cssCloseButton*/ ctx[10]);
    			}

    			if (dirty[0] & /*state, unstyled*/ 3) {
    				toggle_class(button, "close", !/*unstyled*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(435:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (433:10) {#if isFunction(state.closeButton)}
    function create_if_block_2$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*state*/ ctx[1].closeButton;

    	function switch_props(ctx) {
    		return {
    			props: { onClose: /*close*/ ctx[18] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*state*/ ctx[1].closeButton)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(433:10) {#if isFunction(state.closeButton)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*Component*/ ctx[2] && create_if_block$4(ctx);
    	const default_slot_template = /*#slots*/ ctx[47].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[46], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "keydown", /*handleKeydown*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*Component*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*Component*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 32768)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[46],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[46])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[46], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function bind(Component, props = {}) {
    	return function ModalComponent(options) {
    		return new Component({
    				...options,
    				props: { ...props, ...options.props }
    			});
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const baseSetContext = setContext;
    	let { show = null } = $$props;
    	let { key = 'simple-modal' } = $$props;
    	let { ariaLabel = null } = $$props;
    	let { ariaLabelledBy = null } = $$props;
    	let { closeButton = true } = $$props;
    	let { closeOnEsc = true } = $$props;
    	let { closeOnOuterClick = true } = $$props;
    	let { styleBg = {} } = $$props;
    	let { styleWindowWrap = {} } = $$props;
    	let { styleWindow = {} } = $$props;
    	let { styleContent = {} } = $$props;
    	let { styleCloseButton = {} } = $$props;
    	let { classBg = null } = $$props;
    	let { classWindowWrap = null } = $$props;
    	let { classWindow = null } = $$props;
    	let { classContent = null } = $$props;
    	let { classCloseButton = null } = $$props;
    	let { unstyled = false } = $$props;
    	let { setContext: setContext$1 = baseSetContext } = $$props;
    	let { transitionBg = fade } = $$props;
    	let { transitionBgProps = { duration: 250 } } = $$props;
    	let { transitionWindow = transitionBg } = $$props;
    	let { transitionWindowProps = transitionBgProps } = $$props;
    	let { disableFocusTrap = false } = $$props;

    	const defaultState = {
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		unstyled
    	};

    	let state = { ...defaultState };
    	let Component = null;
    	let background;
    	let wrap;
    	let modalWindow;
    	let scrollY;
    	let cssBg;
    	let cssWindowWrap;
    	let cssWindow;
    	let cssContent;
    	let cssCloseButton;
    	let currentTransitionBg;
    	let currentTransitionWindow;
    	let prevBodyPosition;
    	let prevBodyOverflow;
    	let prevBodyWidth;
    	let outerClickTarget;
    	const camelCaseToDash = str => str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();

    	const toCssString = props => props
    	? Object.keys(props).reduce((str, key) => `${str}; ${camelCaseToDash(key)}: ${props[key]}`, '')
    	: '';

    	const isFunction = f => !!(f && f.constructor && f.call && f.apply);

    	const updateStyleTransition = () => {
    		$$invalidate(6, cssBg = toCssString(Object.assign(
    			{},
    			{
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			state.styleBg
    		)));

    		$$invalidate(7, cssWindowWrap = toCssString(state.styleWindowWrap));
    		$$invalidate(8, cssWindow = toCssString(state.styleWindow));
    		$$invalidate(9, cssContent = toCssString(state.styleContent));
    		$$invalidate(10, cssCloseButton = toCssString(state.styleCloseButton));
    		$$invalidate(11, currentTransitionBg = state.transitionBg);
    		$$invalidate(12, currentTransitionWindow = state.transitionWindow);
    	};

    	const toVoid = () => {
    		
    	};

    	let onOpen = toVoid;
    	let onClose = toVoid;
    	let onOpened = toVoid;
    	let onClosed = toVoid;

    	const open = (NewComponent, newProps = {}, options = {}, callback = {}) => {
    		$$invalidate(2, Component = bind(NewComponent, newProps));
    		$$invalidate(1, state = { ...defaultState, ...options });
    		updateStyleTransition();
    		disableScroll();

    		$$invalidate(13, onOpen = event => {
    			if (callback.onOpen) callback.onOpen(event);

    			/**
     * The open event is fired right before the modal opens
     * @event {void} open
     */
    			dispatch('open');

    			/**
     * The opening event is fired right before the modal opens
     * @event {void} opening
     * @deprecated Listen to the `open` event instead
     */
    			dispatch('opening'); // Deprecated. Do not use!
    		});

    		$$invalidate(14, onClose = event => {
    			if (callback.onClose) callback.onClose(event);

    			/**
     * The close event is fired right before the modal closes
     * @event {void} close
     */
    			dispatch('close');

    			/**
     * The closing event is fired right before the modal closes
     * @event {void} closing
     * @deprecated Listen to the `close` event instead
     */
    			dispatch('closing'); // Deprecated. Do not use!
    		});

    		$$invalidate(15, onOpened = event => {
    			if (callback.onOpened) callback.onOpened(event);

    			/**
     * The opened event is fired after the modal's opening transition
     * @event {void} opened
     */
    			dispatch('opened');
    		});

    		$$invalidate(16, onClosed = event => {
    			if (callback.onClosed) callback.onClosed(event);

    			/**
     * The closed event is fired after the modal's closing transition
     * @event {void} closed
     */
    			dispatch('closed');
    		});
    	};

    	const close = (callback = {}) => {
    		if (!Component) return;
    		$$invalidate(14, onClose = callback.onClose || onClose);
    		$$invalidate(16, onClosed = callback.onClosed || onClosed);
    		$$invalidate(2, Component = null);
    		enableScroll();
    	};

    	const handleKeydown = event => {
    		if (state.closeOnEsc && Component && event.key === 'Escape') {
    			event.preventDefault();
    			close();
    		}

    		if (Component && event.key === 'Tab' && !state.disableFocusTrap) {
    			// trap focus
    			const nodes = modalWindow.querySelectorAll('*');

    			const tabbable = Array.from(nodes).filter(node => node.tabIndex >= 0);
    			let index = tabbable.indexOf(document.activeElement);
    			if (index === -1 && event.shiftKey) index = 0;
    			index += tabbable.length + (event.shiftKey ? -1 : 1);
    			index %= tabbable.length;
    			tabbable[index].focus();
    			event.preventDefault();
    		}
    	};

    	const handleOuterMousedown = event => {
    		if (state.closeOnOuterClick && (event.target === background || event.target === wrap)) outerClickTarget = event.target;
    	};

    	const handleOuterMouseup = event => {
    		if (state.closeOnOuterClick && event.target === outerClickTarget) {
    			event.preventDefault();
    			close();
    		}
    	};

    	const disableScroll = () => {
    		scrollY = window.scrollY;
    		prevBodyPosition = document.body.style.position;
    		prevBodyOverflow = document.body.style.overflow;
    		prevBodyWidth = document.body.style.width;
    		document.body.style.position = 'fixed';
    		document.body.style.top = `-${scrollY}px`;
    		document.body.style.overflow = 'hidden';
    		document.body.style.width = '100%';
    	};

    	const enableScroll = () => {
    		document.body.style.position = prevBodyPosition || '';
    		document.body.style.top = '';
    		document.body.style.overflow = prevBodyOverflow || '';
    		document.body.style.width = prevBodyWidth || '';
    		window.scrollTo(0, scrollY);
    	};

    	setContext$1(key, { open, close });
    	let isMounted = false;

    	onDestroy(() => {
    		if (isMounted) close();
    	});

    	onMount(() => {
    		$$invalidate(45, isMounted = true);
    	});

    	const writable_props = [
    		'show',
    		'key',
    		'ariaLabel',
    		'ariaLabelledBy',
    		'closeButton',
    		'closeOnEsc',
    		'closeOnOuterClick',
    		'styleBg',
    		'styleWindowWrap',
    		'styleWindow',
    		'styleContent',
    		'styleCloseButton',
    		'classBg',
    		'classWindowWrap',
    		'classWindow',
    		'classContent',
    		'classCloseButton',
    		'unstyled',
    		'setContext',
    		'transitionBg',
    		'transitionBgProps',
    		'transitionWindow',
    		'transitionWindowProps',
    		'disableFocusTrap'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modalWindow = $$value;
    			$$invalidate(5, modalWindow);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrap = $$value;
    			$$invalidate(4, wrap);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			background = $$value;
    			$$invalidate(3, background);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('$$scope' in $$props) $$invalidate(46, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		bind,
    		svelte,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		baseSetContext,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		unstyled,
    		setContext: setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		defaultState,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		scrollY,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		prevBodyPosition,
    		prevBodyOverflow,
    		prevBodyWidth,
    		outerClickTarget,
    		camelCaseToDash,
    		toCssString,
    		isFunction,
    		updateStyleTransition,
    		toVoid,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		open,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		disableScroll,
    		enableScroll,
    		isMounted
    	});

    	$$self.$inject_state = $$props => {
    		if ('show' in $$props) $$invalidate(22, show = $$props.show);
    		if ('key' in $$props) $$invalidate(23, key = $$props.key);
    		if ('ariaLabel' in $$props) $$invalidate(24, ariaLabel = $$props.ariaLabel);
    		if ('ariaLabelledBy' in $$props) $$invalidate(25, ariaLabelledBy = $$props.ariaLabelledBy);
    		if ('closeButton' in $$props) $$invalidate(26, closeButton = $$props.closeButton);
    		if ('closeOnEsc' in $$props) $$invalidate(27, closeOnEsc = $$props.closeOnEsc);
    		if ('closeOnOuterClick' in $$props) $$invalidate(28, closeOnOuterClick = $$props.closeOnOuterClick);
    		if ('styleBg' in $$props) $$invalidate(29, styleBg = $$props.styleBg);
    		if ('styleWindowWrap' in $$props) $$invalidate(30, styleWindowWrap = $$props.styleWindowWrap);
    		if ('styleWindow' in $$props) $$invalidate(31, styleWindow = $$props.styleWindow);
    		if ('styleContent' in $$props) $$invalidate(32, styleContent = $$props.styleContent);
    		if ('styleCloseButton' in $$props) $$invalidate(33, styleCloseButton = $$props.styleCloseButton);
    		if ('classBg' in $$props) $$invalidate(34, classBg = $$props.classBg);
    		if ('classWindowWrap' in $$props) $$invalidate(35, classWindowWrap = $$props.classWindowWrap);
    		if ('classWindow' in $$props) $$invalidate(36, classWindow = $$props.classWindow);
    		if ('classContent' in $$props) $$invalidate(37, classContent = $$props.classContent);
    		if ('classCloseButton' in $$props) $$invalidate(38, classCloseButton = $$props.classCloseButton);
    		if ('unstyled' in $$props) $$invalidate(0, unstyled = $$props.unstyled);
    		if ('setContext' in $$props) $$invalidate(39, setContext$1 = $$props.setContext);
    		if ('transitionBg' in $$props) $$invalidate(40, transitionBg = $$props.transitionBg);
    		if ('transitionBgProps' in $$props) $$invalidate(41, transitionBgProps = $$props.transitionBgProps);
    		if ('transitionWindow' in $$props) $$invalidate(42, transitionWindow = $$props.transitionWindow);
    		if ('transitionWindowProps' in $$props) $$invalidate(43, transitionWindowProps = $$props.transitionWindowProps);
    		if ('disableFocusTrap' in $$props) $$invalidate(44, disableFocusTrap = $$props.disableFocusTrap);
    		if ('state' in $$props) $$invalidate(1, state = $$props.state);
    		if ('Component' in $$props) $$invalidate(2, Component = $$props.Component);
    		if ('background' in $$props) $$invalidate(3, background = $$props.background);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    		if ('modalWindow' in $$props) $$invalidate(5, modalWindow = $$props.modalWindow);
    		if ('scrollY' in $$props) scrollY = $$props.scrollY;
    		if ('cssBg' in $$props) $$invalidate(6, cssBg = $$props.cssBg);
    		if ('cssWindowWrap' in $$props) $$invalidate(7, cssWindowWrap = $$props.cssWindowWrap);
    		if ('cssWindow' in $$props) $$invalidate(8, cssWindow = $$props.cssWindow);
    		if ('cssContent' in $$props) $$invalidate(9, cssContent = $$props.cssContent);
    		if ('cssCloseButton' in $$props) $$invalidate(10, cssCloseButton = $$props.cssCloseButton);
    		if ('currentTransitionBg' in $$props) $$invalidate(11, currentTransitionBg = $$props.currentTransitionBg);
    		if ('currentTransitionWindow' in $$props) $$invalidate(12, currentTransitionWindow = $$props.currentTransitionWindow);
    		if ('prevBodyPosition' in $$props) prevBodyPosition = $$props.prevBodyPosition;
    		if ('prevBodyOverflow' in $$props) prevBodyOverflow = $$props.prevBodyOverflow;
    		if ('prevBodyWidth' in $$props) prevBodyWidth = $$props.prevBodyWidth;
    		if ('outerClickTarget' in $$props) outerClickTarget = $$props.outerClickTarget;
    		if ('onOpen' in $$props) $$invalidate(13, onOpen = $$props.onOpen);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ('onOpened' in $$props) $$invalidate(15, onOpened = $$props.onOpened);
    		if ('onClosed' in $$props) $$invalidate(16, onClosed = $$props.onClosed);
    		if ('isMounted' in $$props) $$invalidate(45, isMounted = $$props.isMounted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*show*/ 4194304 | $$self.$$.dirty[1] & /*isMounted*/ 16384) {
    			{
    				if (isMounted) {
    					if (isFunction(show)) {
    						open(show);
    					} else {
    						close();
    					}
    				}
    			}
    		}
    	};

    	return [
    		unstyled,
    		state,
    		Component,
    		background,
    		wrap,
    		modalWindow,
    		cssBg,
    		cssWindowWrap,
    		cssWindow,
    		cssContent,
    		cssCloseButton,
    		currentTransitionBg,
    		currentTransitionWindow,
    		onOpen,
    		onClose,
    		onOpened,
    		onClosed,
    		isFunction,
    		close,
    		handleKeydown,
    		handleOuterMousedown,
    		handleOuterMouseup,
    		show,
    		key,
    		ariaLabel,
    		ariaLabelledBy,
    		closeButton,
    		closeOnEsc,
    		closeOnOuterClick,
    		styleBg,
    		styleWindowWrap,
    		styleWindow,
    		styleContent,
    		styleCloseButton,
    		classBg,
    		classWindowWrap,
    		classWindow,
    		classContent,
    		classCloseButton,
    		setContext$1,
    		transitionBg,
    		transitionBgProps,
    		transitionWindow,
    		transitionWindowProps,
    		disableFocusTrap,
    		isMounted,
    		$$scope,
    		slots,
    		div1_binding,
    		div2_binding,
    		div3_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				show: 22,
    				key: 23,
    				ariaLabel: 24,
    				ariaLabelledBy: 25,
    				closeButton: 26,
    				closeOnEsc: 27,
    				closeOnOuterClick: 28,
    				styleBg: 29,
    				styleWindowWrap: 30,
    				styleWindow: 31,
    				styleContent: 32,
    				styleCloseButton: 33,
    				classBg: 34,
    				classWindowWrap: 35,
    				classWindow: 36,
    				classContent: 37,
    				classCloseButton: 38,
    				unstyled: 0,
    				setContext: 39,
    				transitionBg: 40,
    				transitionBgProps: 41,
    				transitionWindow: 42,
    				transitionWindowProps: 43,
    				disableFocusTrap: 44
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get show() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set show(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabel() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaLabelledBy() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabelledBy(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnEsc() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnEsc(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnOuterClick() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnOuterClick(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get styleCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set styleCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindowWrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindowWrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classContent() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classContent(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classCloseButton() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classCloseButton(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get unstyled() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set unstyled(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setContext() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set setContext(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBg() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBg(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionBgProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionBgProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindow() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindow(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionWindowProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionWindowProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disableFocusTrap() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disableFocusTrap(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\SeeMore.svelte generated by Svelte v3.47.0 */
    const file$7 = "src\\components\\SeeMore.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i].posts;
    	child_ctx[17] = list[i].label;
    	child_ctx[18] = list[i].id;
    	child_ctx[19] = list[i].total;
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i].label;
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i].label;
    	return child_ctx;
    }

    function get_each_context_5$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (55:0) <Modal show={$modal}>
    function create_default_slot$3(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Show modal";
    			attr_dev(button, "class", "modal-button svelte-vyja3r");
    			add_location(button, file$7, 55, 2, 1422);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showModal*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(55:0) <Modal show={$modal}>",
    		ctx
    	});

    	return block;
    }

    // (146:8) {:else}
    function create_else_block$2(ctx) {
    	let noresult;
    	let current;
    	noresult = new NoResult({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(noresult.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(noresult, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(noresult.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(noresult.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(noresult, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(146:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (67:31) 
    function create_if_block_2$3(ctx) {
    	let div0;
    	let lightpaginationnav;
    	let t0;
    	let div1;
    	let table;
    	let thead;
    	let tr;
    	let th;
    	let t2;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t3;
    	let tbody;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let current;

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: /*data*/ ctx[13][0].total,
    				pageSize: 10,
    				currentPage: /*page*/ ctx[0],
    				limit: 1
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", /*setPage_handler*/ ctx[10]);
    	let each_value_5 = /*$cols*/ ctx[3];
    	validate_each_argument(each_value_5);
    	const get_key = ctx => /*c*/ ctx[25][0].id;
    	validate_each_keys(ctx, each_value_5, get_each_context_5$1, get_key);

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		let child_ctx = get_each_context_5$1(ctx, each_value_5, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_5$1(key, child_ctx));
    	}

    	let each_value = /*data*/ ctx[13];
    	validate_each_argument(each_value);
    	const get_key_1 = ctx => /*id*/ ctx[18];
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key_1);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(lightpaginationnav.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th = element("th");
    			th.textContent = "Title";
    			t2 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "area-4 svelte-vyja3r");
    			add_location(div0, file$7, 67, 10, 1847);
    			attr_dev(th, "class", "svelte-vyja3r");
    			add_location(th, file$7, 81, 18, 2249);
    			attr_dev(tr, "class", "svelte-vyja3r");
    			add_location(tr, file$7, 80, 16, 2225);
    			add_location(thead, file$7, 79, 14, 2200);
    			add_location(tbody, file$7, 88, 14, 2447);
    			attr_dev(table, "class", "svelte-vyja3r");
    			add_location(table, file$7, 78, 12, 2177);
    			attr_dev(div1, "class", "table-wrapper svelte-vyja3r");
    			add_location(div1, file$7, 77, 10, 2136);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(lightpaginationnav, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th);
    			append_dev(tr, t2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t3);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lightpaginationnav_changes = {};
    			if (dirty[0] & /*data*/ 8192) lightpaginationnav_changes.totalItems = /*data*/ ctx[13][0].total;
    			if (dirty[0] & /*page*/ 1) lightpaginationnav_changes.currentPage = /*page*/ ctx[0];
    			lightpaginationnav.$set(lightpaginationnav_changes);

    			if (dirty[0] & /*$cols*/ 8) {
    				each_value_5 = /*$cols*/ ctx[3];
    				validate_each_argument(each_value_5);
    				validate_each_keys(ctx, each_value_5, get_each_context_5$1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_5, each0_lookup, tr, destroy_block, create_each_block_5$1, null, get_each_context_5$1);
    			}

    			if (dirty[0] & /*data, $cols*/ 8200) {
    				each_value = /*data*/ ctx[13];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, tbody, destroy_block, create_each_block$2, null, get_each_context$2);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(lightpaginationnav);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(67:31) ",
    		ctx
    	});

    	return block;
    }

    // (65:26) 
    function create_if_block_1$3(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Error";
    			add_location(span, file$7, 65, 10, 1784);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(65:26) ",
    		ctx
    	});

    	return block;
    }

    // (63:8) {#if isFetching}
    function create_if_block$3(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Loading...";
    			add_location(h2, file$7, 63, 10, 1725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(63:8) {#if isFetching}",
    		ctx
    	});

    	return block;
    }

    // (84:18) {#each $cols as c (c[0].id)}
    function create_each_block_5$1(key_1, ctx) {
    	let th;
    	let t_value = /*c*/ ctx[25][0].label + "";
    	let t;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-vyja3r");
    			add_location(th, file$7, 84, 20, 2336);
    			this.first = th;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$cols*/ 8 && t_value !== (t_value = /*c*/ ctx[25][0].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5$1.name,
    		type: "each",
    		source: "(84:18) {#each $cols as c (c[0].id)}",
    		ctx
    	});

    	return block;
    }

    // (97:24) {#if c[0].id == 'client-location'}
    function create_if_block_13$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].clientLocation + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 97, 26, 2820);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].clientLocation + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13$1.name,
    		type: "if",
    		source: "(97:24) {#if c[0].id == 'client-location'}",
    		ctx
    	});

    	return block;
    }

    // (100:24) {#if c[0].id == 'product'}
    function create_if_block_12$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].product + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 100, 26, 2961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].product + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12$1.name,
    		type: "if",
    		source: "(100:24) {#if c[0].id == 'product'}",
    		ctx
    	});

    	return block;
    }

    // (103:24) {#if c[0].id == 'campaign'}
    function create_if_block_11$1(ctx) {
    	let td;
    	let each_value_4 = /*post*/ ctx[22].campaign;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			td = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 103, 26, 3096);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192) {
    				each_value_4 = /*post*/ ctx[22].campaign;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11$1.name,
    		type: "if",
    		source: "(103:24) {#if c[0].id == 'campaign'}",
    		ctx
    	});

    	return block;
    }

    // (105:28) {#each post.campaign as { label }}
    function create_each_block_4$1(ctx) {
    	let span;
    	let t_value = /*label*/ ctx[17] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$7, 104, 62, 3164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*label*/ ctx[17] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(105:28) {#each post.campaign as { label }}",
    		ctx
    	});

    	return block;
    }

    // (111:24) {#if c[0].id == 'link'}
    function create_if_block_10$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].link + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 111, 26, 3428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].link + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10$1.name,
    		type: "if",
    		source: "(111:24) {#if c[0].id == 'link'}",
    		ctx
    	});

    	return block;
    }

    // (114:24) {#if c[0].id == 'linkUnlocked'}
    function create_if_block_9$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].linkUnlocked + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 114, 26, 3564);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].linkUnlocked + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9$1.name,
    		type: "if",
    		source: "(114:24) {#if c[0].id == 'linkUnlocked'}",
    		ctx
    	});

    	return block;
    }

    // (117:24) {#if c[0].id == 'pdf'}
    function create_if_block_8$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].pdf + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 117, 26, 3699);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].pdf + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(117:24) {#if c[0].id == 'pdf'}",
    		ctx
    	});

    	return block;
    }

    // (120:24) {#if c[0].id == 'clientHQ'}
    function create_if_block_7$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].clientHQ + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 120, 26, 3830);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].clientHQ + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(120:24) {#if c[0].id == 'clientHQ'}",
    		ctx
    	});

    	return block;
    }

    // (123:24) {#if c[0].id == 'target-location'}
    function create_if_block_6$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].targetLocation + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 123, 26, 3973);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].targetLocation + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(123:24) {#if c[0].id == 'target-location'}",
    		ctx
    	});

    	return block;
    }

    // (126:24) {#if c[0].id == 'target-industry'}
    function create_if_block_5$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].targetIndustry + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 126, 26, 4122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].targetIndustry + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(126:24) {#if c[0].id == 'target-industry'}",
    		ctx
    	});

    	return block;
    }

    // (129:24) {#if c[0].id == 'target-dm'}
    function create_if_block_4$1(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[22].targetDM + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 129, 26, 4265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*post*/ ctx[22].targetDM + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(129:24) {#if c[0].id == 'target-dm'}",
    		ctx
    	});

    	return block;
    }

    // (132:24) {#if c[0].id == 'results'}
    function create_if_block_3$2(ctx) {
    	let td;
    	let each_value_3 = /*post*/ ctx[22].results;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			td = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 132, 26, 4400);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192) {
    				each_value_3 = /*post*/ ctx[22].results;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(132:24) {#if c[0].id == 'results'}",
    		ctx
    	});

    	return block;
    }

    // (134:28) {#each post.results as { label }}
    function create_each_block_3$1(ctx) {
    	let span;
    	let t_value = /*label*/ ctx[17] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$7, 134, 30, 4499);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 8192 && t_value !== (t_value = /*label*/ ctx[17] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(134:28) {#each post.results as { label }}",
    		ctx
    	});

    	return block;
    }

    // (96:22) {#each $cols as c (c[0].id)}
    function create_each_block_2$1(key_1, ctx) {
    	let first;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let if_block10_anchor;
    	let if_block0 = /*c*/ ctx[25][0].id == 'client-location' && create_if_block_13$1(ctx);
    	let if_block1 = /*c*/ ctx[25][0].id == 'product' && create_if_block_12$1(ctx);
    	let if_block2 = /*c*/ ctx[25][0].id == 'campaign' && create_if_block_11$1(ctx);
    	let if_block3 = /*c*/ ctx[25][0].id == 'link' && create_if_block_10$1(ctx);
    	let if_block4 = /*c*/ ctx[25][0].id == 'linkUnlocked' && create_if_block_9$1(ctx);
    	let if_block5 = /*c*/ ctx[25][0].id == 'pdf' && create_if_block_8$1(ctx);
    	let if_block6 = /*c*/ ctx[25][0].id == 'clientHQ' && create_if_block_7$1(ctx);
    	let if_block7 = /*c*/ ctx[25][0].id == 'target-location' && create_if_block_6$1(ctx);
    	let if_block8 = /*c*/ ctx[25][0].id == 'target-industry' && create_if_block_5$1(ctx);
    	let if_block9 = /*c*/ ctx[25][0].id == 'target-dm' && create_if_block_4$1(ctx);
    	let if_block10 = /*c*/ ctx[25][0].id == 'results' && create_if_block_3$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			t8 = space();
    			if (if_block9) if_block9.c();
    			t9 = space();
    			if (if_block10) if_block10.c();
    			if_block10_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block6) if_block6.m(target, anchor);
    			insert_dev(target, t6, anchor);
    			if (if_block7) if_block7.m(target, anchor);
    			insert_dev(target, t7, anchor);
    			if (if_block8) if_block8.m(target, anchor);
    			insert_dev(target, t8, anchor);
    			if (if_block9) if_block9.m(target, anchor);
    			insert_dev(target, t9, anchor);
    			if (if_block10) if_block10.m(target, anchor);
    			insert_dev(target, if_block10_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*c*/ ctx[25][0].id == 'client-location') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_13$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'product') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_12$1(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'campaign') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_11$1(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'link') {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_10$1(ctx);
    					if_block3.c();
    					if_block3.m(t3.parentNode, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'linkUnlocked') {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_9$1(ctx);
    					if_block4.c();
    					if_block4.m(t4.parentNode, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'pdf') {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_8$1(ctx);
    					if_block5.c();
    					if_block5.m(t5.parentNode, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'clientHQ') {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_7$1(ctx);
    					if_block6.c();
    					if_block6.m(t6.parentNode, t6);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'target-location') {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_6$1(ctx);
    					if_block7.c();
    					if_block7.m(t7.parentNode, t7);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'target-industry') {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_5$1(ctx);
    					if_block8.c();
    					if_block8.m(t8.parentNode, t8);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'target-dm') {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_4$1(ctx);
    					if_block9.c();
    					if_block9.m(t9.parentNode, t9);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*c*/ ctx[25][0].id == 'results') {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block_3$2(ctx);
    					if_block10.c();
    					if_block10.m(if_block10_anchor.parentNode, if_block10_anchor);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block6) if_block6.d(detaching);
    			if (detaching) detach_dev(t6);
    			if (if_block7) if_block7.d(detaching);
    			if (detaching) detach_dev(t7);
    			if (if_block8) if_block8.d(detaching);
    			if (detaching) detach_dev(t8);
    			if (if_block9) if_block9.d(detaching);
    			if (detaching) detach_dev(t9);
    			if (if_block10) if_block10.d(detaching);
    			if (detaching) detach_dev(if_block10_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(96:22) {#each $cols as c (c[0].id)}",
    		ctx
    	});

    	return block;
    }

    // (93:18) {#each posts as post (post.id)}
    function create_each_block_1$1(key_1, ctx) {
    	let tr;
    	let td;
    	let t0_value = /*post*/ ctx[22].title + "";
    	let t0;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t2;
    	let each_value_2 = /*$cols*/ ctx[3];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*c*/ ctx[25][0].id;
    	validate_each_keys(ctx, each_value_2, get_each_context_2$1, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2$1(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2$1(key, child_ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(td, "class", "svelte-vyja3r");
    			add_location(td, file$7, 94, 22, 2659);
    			attr_dev(tr, "class", "svelte-vyja3r");
    			add_location(tr, file$7, 93, 20, 2631);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, t0);
    			append_dev(tr, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t2);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*data*/ 8192 && t0_value !== (t0_value = /*post*/ ctx[22].title + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*data, $cols*/ 8200) {
    				each_value_2 = /*$cols*/ ctx[3];
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, tr, destroy_block, create_each_block_2$1, t2, get_each_context_2$1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(93:18) {#each posts as post (post.id)}",
    		ctx
    	});

    	return block;
    }

    // (90:16) {#each data as { posts, label, id, total }
    function create_each_block$2(key_1, ctx) {
    	let h4;
    	let t0_value = /*label*/ ctx[17] + "";
    	let t0;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let each_value_1 = /*posts*/ ctx[16];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*post*/ ctx[22].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			add_location(h4, file$7, 90, 18, 2540);
    			this.first = h4;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*data*/ 8192 && t0_value !== (t0_value = /*label*/ ctx[17] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$cols, data*/ 8200) {
    				each_value_1 = /*posts*/ ctx[16];
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block_1$1, each_1_anchor, get_each_context_1$1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(90:16) {#each data as { posts, label, id, total }",
    		ctx
    	});

    	return block;
    }

    // (60:2) 
    function create_query_slot$2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_1$3, create_if_block_2$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isFetching*/ ctx[14]) return 0;
    		if (/*isError*/ ctx[15]) return 1;
    		if (/*data*/ ctx[13]?.length) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "results svelte-fhxlyi");
    			add_location(div0, file$7, 61, 6, 1652);
    			attr_dev(div1, "class", "cntnr svelte-y5n953");
    			add_location(div1, file$7, 60, 4, 1611);
    			attr_dev(div2, "slot", "query");
    			add_location(div2, file$7, 59, 2, 1539);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_query_slot$2.name,
    		type: "slot",
    		source: "(60:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let searchformclose;
    	let t0;
    	let modal_1;
    	let t1;
    	let query;
    	let current;
    	searchformclose = new SearchFormClose({ $$inline: true });

    	modal_1 = new Modal({
    			props: {
    				show: /*$modal*/ ctx[2],
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	query = new Query$1({
    			props: {
    				options: /*queryOptions*/ ctx[1],
    				$$slots: {
    					query: [
    						create_query_slot$2,
    						({ queryResult: { data, isFetching, isError } }) => ({ 13: data, 14: isFetching, 15: isError }),
    						({ queryResult: data_data_isFetching_isFetching_isError_isError }) => [
    							(data_data_isFetching_isFetching_isError_isError
    							? 8192
    							: 0) | (data_data_isFetching_isFetching_isError_isError
    							? 16384
    							: 0) | (data_data_isFetching_isFetching_isError_isError
    							? 32768
    							: 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(searchformclose.$$.fragment);
    			t0 = space();
    			create_component(modal_1.$$.fragment);
    			t1 = space();
    			create_component(query.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchformclose, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(modal_1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(query, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_1_changes = {};
    			if (dirty[0] & /*$modal*/ 4) modal_1_changes.show = /*$modal*/ ctx[2];

    			if (dirty[1] & /*$$scope*/ 8) {
    				modal_1_changes.$$scope = { dirty, ctx };
    			}

    			modal_1.$set(modal_1_changes);
    			const query_changes = {};
    			if (dirty[0] & /*queryOptions*/ 2) query_changes.options = /*queryOptions*/ ctx[1];

    			if (dirty[0] & /*isFetching, isError, data, $cols, page*/ 57353 | dirty[1] & /*$$scope*/ 8) {
    				query_changes.$$scope = { dirty, ctx };
    			}

    			query.$set(query_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchformclose.$$.fragment, local);
    			transition_in(modal_1.$$.fragment, local);
    			transition_in(query.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchformclose.$$.fragment, local);
    			transition_out(modal_1.$$.fragment, local);
    			transition_out(query.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchformclose, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(modal_1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(query, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let field;
    	let queryOptions;
    	let $SearchTerm;
    	let $fields;
    	let $modal;
    	let $cols;
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(8, $SearchTerm = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(9, $fields = $$value));
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(3, $cols = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SeeMore', slots, []);
    	const modal = writable(null);
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, value => $$invalidate(2, $modal = value));
    	const showModal = () => modal.set(bind(Popup));
    	let page = 1;
    	let s;
    	const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;

    	async function fetchPosts({ page = 1, s, field }) {
    		const res = await fetch(`${url}?s=${s}&page=${page}&per_page=10&fields=${field}`);
    		const data = await res.json();
    		return data;
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SeeMore> was created with unknown prop '${key}'`);
    	});

    	const setPage_handler = e => $$invalidate(0, page = e.detail.page);

    	$$self.$capture_state = () => ({
    		SearchFormClose,
    		Query: Query$1,
    		SearchTerm,
    		fields,
    		LightPaginationNav,
    		cols,
    		NoResult,
    		writable,
    		Modal,
    		bind,
    		Popup,
    		modal,
    		showModal,
    		page,
    		s,
    		url,
    		fetchPosts,
    		field,
    		queryOptions,
    		$SearchTerm,
    		$fields,
    		$modal,
    		$cols
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('s' in $$props) $$invalidate(6, s = $$props.s);
    		if ('field' in $$props) $$invalidate(7, field = $$props.field);
    		if ('queryOptions' in $$props) $$invalidate(1, queryOptions = $$props.queryOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$SearchTerm*/ 256) {
    			$$invalidate(6, s = $SearchTerm.toLowerCase());
    		}

    		if ($$self.$$.dirty[0] & /*$fields*/ 512) {
    			$$invalidate(7, field = $fields);
    		}

    		if ($$self.$$.dirty[0] & /*page, s, field, $SearchTerm*/ 449) {
    			$$invalidate(1, queryOptions = {
    				queryKey: ['seeMore', page, s, field],
    				queryFn: () => fetchPosts({ page, s, field }),
    				enabled: $SearchTerm !== '',
    				keepPreviousData: true,
    				cacheTime: 1000 * 60 * 5
    			});
    		}
    	};

    	return [
    		page,
    		queryOptions,
    		$modal,
    		$cols,
    		modal,
    		showModal,
    		s,
    		field,
    		$SearchTerm,
    		$fields,
    		setPage_handler
    	];
    }

    class SeeMore extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SeeMore",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\MoreFieldResult.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file$6 = "src\\components\\MoreFieldResult.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i].posts;
    	child_ctx[18] = list[i].label;
    	child_ctx[19] = list[i].id;
    	child_ctx[20] = list[i].total;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i].label;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i].label;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    // (69:0) <Modal show={$modal}>
    function create_default_slot$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Show modal";
    			attr_dev(button, "class", "modal-button svelte-p0ahla");
    			add_location(button, file$6, 69, 2, 1790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showModal*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(69:0) <Modal show={$modal}>",
    		ctx
    	});

    	return block;
    }

    // (160:8) {:else}
    function create_else_block$1(ctx) {
    	let noresult;
    	let current;
    	noresult = new NoResult({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(noresult.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(noresult, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(noresult.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(noresult.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(noresult, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(160:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (81:31) 
    function create_if_block_2$2(ctx) {
    	let t;
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let if_block = /*$selection*/ ctx[1] > 0 && create_if_block_14(ctx);
    	let each_value = /*data*/ ctx[14];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[19];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "table-wrapper svelte-p0ahla");
    			add_location(div, file$6, 92, 10, 2569);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$selection*/ ctx[1] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*$selection*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_14(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*data, $cols*/ 16400) {
    				each_value = /*data*/ ctx[14];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, destroy_block, create_each_block$1, null, get_each_context$1);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(81:31) ",
    		ctx
    	});

    	return block;
    }

    // (79:26) 
    function create_if_block_1$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Error";
    			add_location(span, file$6, 79, 10, 2152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(79:26) ",
    		ctx
    	});

    	return block;
    }

    // (77:8) {#if isFetching}
    function create_if_block$2(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Loading...";
    			add_location(h2, file$6, 77, 10, 2093);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(77:8) {#if isFetching}",
    		ctx
    	});

    	return block;
    }

    // (82:10) {#if $selection > 0}
    function create_if_block_14(ctx) {
    	let div;
    	let lightpaginationnav;
    	let current;

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: /*data*/ ctx[14][0].total,
    				pageSize: 10,
    				currentPage: /*page*/ ctx[0],
    				limit: 1
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", /*setPage_handler*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(lightpaginationnav.$$.fragment);
    			attr_dev(div, "class", "area-4 svelte-p0ahla");
    			add_location(div, file$6, 82, 12, 2249);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(lightpaginationnav, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const lightpaginationnav_changes = {};
    			if (dirty[0] & /*data*/ 16384) lightpaginationnav_changes.totalItems = /*data*/ ctx[14][0].total;
    			if (dirty[0] & /*page*/ 1) lightpaginationnav_changes.currentPage = /*page*/ ctx[0];
    			lightpaginationnav.$set(lightpaginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(lightpaginationnav);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(82:10) {#if $selection > 0}",
    		ctx
    	});

    	return block;
    }

    // (101:20) {#each $cols as c (c[0].id)}
    function create_each_block_5(key_1, ctx) {
    	let th;
    	let t_value = /*c*/ ctx[26][0].label + "";
    	let t;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			th = element("th");
    			t = text(t_value);
    			attr_dev(th, "class", "svelte-p0ahla");
    			add_location(th, file$6, 101, 22, 2875);
    			this.first = th;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$cols*/ 16 && t_value !== (t_value = /*c*/ ctx[26][0].label + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(101:20) {#each $cols as c (c[0].id)}",
    		ctx
    	});

    	return block;
    }

    // (111:24) {#if c[0].id == 'client-location'}
    function create_if_block_13(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].clientLocation + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 111, 26, 3263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].clientLocation + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(111:24) {#if c[0].id == 'client-location'}",
    		ctx
    	});

    	return block;
    }

    // (114:24) {#if c[0].id == 'product'}
    function create_if_block_12(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].product + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 114, 26, 3404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].product + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(114:24) {#if c[0].id == 'product'}",
    		ctx
    	});

    	return block;
    }

    // (117:24) {#if c[0].id == 'campaign'}
    function create_if_block_11(ctx) {
    	let td;
    	let each_value_4 = /*post*/ ctx[23].campaign;
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const block = {
    		c: function create() {
    			td = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 117, 26, 3539);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384) {
    				each_value_4 = /*post*/ ctx[23].campaign;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(117:24) {#if c[0].id == 'campaign'}",
    		ctx
    	});

    	return block;
    }

    // (119:28) {#each post.campaign as { label }}
    function create_each_block_4(ctx) {
    	let span;
    	let t_value = /*label*/ ctx[18] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$6, 118, 62, 3607);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*label*/ ctx[18] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(119:28) {#each post.campaign as { label }}",
    		ctx
    	});

    	return block;
    }

    // (125:24) {#if c[0].id == 'link'}
    function create_if_block_10(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].link + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 125, 26, 3871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].link + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(125:24) {#if c[0].id == 'link'}",
    		ctx
    	});

    	return block;
    }

    // (128:24) {#if c[0].id == 'linkUnlocked'}
    function create_if_block_9(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].linkUnlocked + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 128, 26, 4007);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].linkUnlocked + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(128:24) {#if c[0].id == 'linkUnlocked'}",
    		ctx
    	});

    	return block;
    }

    // (131:24) {#if c[0].id == 'pdf'}
    function create_if_block_8(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].pdf + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 131, 26, 4142);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].pdf + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(131:24) {#if c[0].id == 'pdf'}",
    		ctx
    	});

    	return block;
    }

    // (134:24) {#if c[0].id == 'clientHQ'}
    function create_if_block_7(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].clientHQ + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 134, 26, 4273);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].clientHQ + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(134:24) {#if c[0].id == 'clientHQ'}",
    		ctx
    	});

    	return block;
    }

    // (137:24) {#if c[0].id == 'target-location'}
    function create_if_block_6(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].targetLocation + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 137, 26, 4416);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].targetLocation + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(137:24) {#if c[0].id == 'target-location'}",
    		ctx
    	});

    	return block;
    }

    // (140:24) {#if c[0].id == 'target-industry'}
    function create_if_block_5(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].targetIndustry + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 140, 26, 4565);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].targetIndustry + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(140:24) {#if c[0].id == 'target-industry'}",
    		ctx
    	});

    	return block;
    }

    // (143:24) {#if c[0].id == 'target-dm'}
    function create_if_block_4(ctx) {
    	let td;
    	let t_value = /*post*/ ctx[23].targetDM + "";
    	let t;

    	const block = {
    		c: function create() {
    			td = element("td");
    			t = text(t_value);
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 143, 26, 4708);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*post*/ ctx[23].targetDM + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(143:24) {#if c[0].id == 'target-dm'}",
    		ctx
    	});

    	return block;
    }

    // (146:24) {#if c[0].id == 'results'}
    function create_if_block_3$1(ctx) {
    	let td;
    	let each_value_3 = /*post*/ ctx[23].results;
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			td = element("td");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 146, 26, 4843);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(td, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384) {
    				each_value_3 = /*post*/ ctx[23].results;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(td, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(146:24) {#if c[0].id == 'results'}",
    		ctx
    	});

    	return block;
    }

    // (148:28) {#each post.results as { label }}
    function create_each_block_3(ctx) {
    	let span;
    	let t_value = /*label*/ ctx[18] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			add_location(span, file$6, 148, 30, 4942);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*data*/ 16384 && t_value !== (t_value = /*label*/ ctx[18] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(148:28) {#each post.results as { label }}",
    		ctx
    	});

    	return block;
    }

    // (110:22) {#each $cols as c (c[0].id)}
    function create_each_block_2(key_1, ctx) {
    	let first;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let if_block10_anchor;
    	let if_block0 = /*c*/ ctx[26][0].id == 'client-location' && create_if_block_13(ctx);
    	let if_block1 = /*c*/ ctx[26][0].id == 'product' && create_if_block_12(ctx);
    	let if_block2 = /*c*/ ctx[26][0].id == 'campaign' && create_if_block_11(ctx);
    	let if_block3 = /*c*/ ctx[26][0].id == 'link' && create_if_block_10(ctx);
    	let if_block4 = /*c*/ ctx[26][0].id == 'linkUnlocked' && create_if_block_9(ctx);
    	let if_block5 = /*c*/ ctx[26][0].id == 'pdf' && create_if_block_8(ctx);
    	let if_block6 = /*c*/ ctx[26][0].id == 'clientHQ' && create_if_block_7(ctx);
    	let if_block7 = /*c*/ ctx[26][0].id == 'target-location' && create_if_block_6(ctx);
    	let if_block8 = /*c*/ ctx[26][0].id == 'target-industry' && create_if_block_5(ctx);
    	let if_block9 = /*c*/ ctx[26][0].id == 'target-dm' && create_if_block_4(ctx);
    	let if_block10 = /*c*/ ctx[26][0].id == 'results' && create_if_block_3$1(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			t3 = space();
    			if (if_block4) if_block4.c();
    			t4 = space();
    			if (if_block5) if_block5.c();
    			t5 = space();
    			if (if_block6) if_block6.c();
    			t6 = space();
    			if (if_block7) if_block7.c();
    			t7 = space();
    			if (if_block8) if_block8.c();
    			t8 = space();
    			if (if_block9) if_block9.c();
    			t9 = space();
    			if (if_block10) if_block10.c();
    			if_block10_anchor = empty();
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block4) if_block4.m(target, anchor);
    			insert_dev(target, t4, anchor);
    			if (if_block5) if_block5.m(target, anchor);
    			insert_dev(target, t5, anchor);
    			if (if_block6) if_block6.m(target, anchor);
    			insert_dev(target, t6, anchor);
    			if (if_block7) if_block7.m(target, anchor);
    			insert_dev(target, t7, anchor);
    			if (if_block8) if_block8.m(target, anchor);
    			insert_dev(target, t8, anchor);
    			if (if_block9) if_block9.m(target, anchor);
    			insert_dev(target, t9, anchor);
    			if (if_block10) if_block10.m(target, anchor);
    			insert_dev(target, if_block10_anchor, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*c*/ ctx[26][0].id == 'client-location') {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_13(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'product') {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_12(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'campaign') {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_11(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'link') {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_10(ctx);
    					if_block3.c();
    					if_block3.m(t3.parentNode, t3);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'linkUnlocked') {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);
    				} else {
    					if_block4 = create_if_block_9(ctx);
    					if_block4.c();
    					if_block4.m(t4.parentNode, t4);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'pdf') {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_8(ctx);
    					if_block5.c();
    					if_block5.m(t5.parentNode, t5);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'clientHQ') {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);
    				} else {
    					if_block6 = create_if_block_7(ctx);
    					if_block6.c();
    					if_block6.m(t6.parentNode, t6);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'target-location') {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);
    				} else {
    					if_block7 = create_if_block_6(ctx);
    					if_block7.c();
    					if_block7.m(t7.parentNode, t7);
    				}
    			} else if (if_block7) {
    				if_block7.d(1);
    				if_block7 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'target-industry') {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_5(ctx);
    					if_block8.c();
    					if_block8.m(t8.parentNode, t8);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'target-dm') {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block_4(ctx);
    					if_block9.c();
    					if_block9.m(t9.parentNode, t9);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (/*c*/ ctx[26][0].id == 'results') {
    				if (if_block10) {
    					if_block10.p(ctx, dirty);
    				} else {
    					if_block10 = create_if_block_3$1(ctx);
    					if_block10.c();
    					if_block10.m(if_block10_anchor.parentNode, if_block10_anchor);
    				}
    			} else if (if_block10) {
    				if_block10.d(1);
    				if_block10 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(t3);
    			if (if_block4) if_block4.d(detaching);
    			if (detaching) detach_dev(t4);
    			if (if_block5) if_block5.d(detaching);
    			if (detaching) detach_dev(t5);
    			if (if_block6) if_block6.d(detaching);
    			if (detaching) detach_dev(t6);
    			if (if_block7) if_block7.d(detaching);
    			if (detaching) detach_dev(t7);
    			if (if_block8) if_block8.d(detaching);
    			if (detaching) detach_dev(t8);
    			if (if_block9) if_block9.d(detaching);
    			if (detaching) detach_dev(t9);
    			if (if_block10) if_block10.d(detaching);
    			if (detaching) detach_dev(if_block10_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(110:22) {#each $cols as c (c[0].id)}",
    		ctx
    	});

    	return block;
    }

    // (107:18) {#each posts as post (post.id)}
    function create_each_block_1(key_1, ctx) {
    	let tr;
    	let td;
    	let t0_value = /*post*/ ctx[23].title + "";
    	let t0;
    	let t1;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t2;
    	let each_value_2 = /*$cols*/ ctx[4];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*c*/ ctx[26][0].id;
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");
    			td = element("td");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(td, "class", "svelte-p0ahla");
    			add_location(td, file$6, 108, 22, 3102);
    			attr_dev(tr, "class", "svelte-p0ahla");
    			add_location(tr, file$6, 107, 20, 3074);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, td);
    			append_dev(td, t0);
    			append_dev(tr, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t2);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*data*/ 16384 && t0_value !== (t0_value = /*post*/ ctx[23].title + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*data, $cols*/ 16400) {
    				each_value_2 = /*$cols*/ ctx[4];
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, tr, destroy_block, create_each_block_2, t2, get_each_context_2);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(107:18) {#each posts as post (post.id)}",
    		ctx
    	});

    	return block;
    }

    // (94:12) {#each data as { posts, label, id, total }
    function create_each_block$1(key_1, ctx) {
    	let h4;
    	let t0_value = /*label*/ ctx[18] + "";
    	let t0;
    	let t1;
    	let table;
    	let thead;
    	let tr;
    	let th;
    	let t3;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t4;
    	let tbody;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let t5;
    	let each_value_5 = /*$cols*/ ctx[4];
    	validate_each_argument(each_value_5);
    	const get_key = ctx => /*c*/ ctx[26][0].id;
    	validate_each_keys(ctx, each_value_5, get_each_context_5, get_key);

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		let child_ctx = get_each_context_5(ctx, each_value_5, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_5(key, child_ctx));
    	}

    	let each_value_1 = /*posts*/ ctx[17];
    	validate_each_argument(each_value_1);
    	const get_key_1 = ctx => /*post*/ ctx[23].id;
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key_1);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			h4 = element("h4");
    			t0 = text(t0_value);
    			t1 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th = element("th");
    			th.textContent = "Title";
    			t3 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			add_location(h4, file$6, 94, 14, 2674);
    			attr_dev(th, "class", "svelte-p0ahla");
    			add_location(th, file$6, 98, 20, 2784);
    			attr_dev(tr, "class", "svelte-p0ahla");
    			add_location(tr, file$6, 97, 18, 2758);
    			add_location(thead, file$6, 96, 16, 2731);
    			add_location(tbody, file$6, 105, 16, 2994);
    			attr_dev(table, "class", "svelte-p0ahla");
    			add_location(table, file$6, 95, 14, 2706);
    			this.first = h4;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th);
    			append_dev(tr, t3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t4);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			append_dev(table, t5);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*data*/ 16384 && t0_value !== (t0_value = /*label*/ ctx[18] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$cols*/ 16) {
    				each_value_5 = /*$cols*/ ctx[4];
    				validate_each_argument(each_value_5);
    				validate_each_keys(ctx, each_value_5, get_each_context_5, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_5, each0_lookup, tr, destroy_block, create_each_block_5, null, get_each_context_5);
    			}

    			if (dirty[0] & /*$cols, data*/ 16400) {
    				each_value_1 = /*posts*/ ctx[17];
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value_1, each1_lookup, tbody, destroy_block, create_each_block_1, null, get_each_context_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(94:12) {#each data as { posts, label, id, total }",
    		ctx
    	});

    	return block;
    }

    // (74:2) 
    function create_query_slot$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$2, create_if_block_2$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isFetching*/ ctx[15]) return 0;
    		if (/*isError*/ ctx[16]) return 1;
    		if (/*data*/ ctx[14]?.length) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			attr_dev(div0, "class", "results svelte-fhxlyi");
    			add_location(div0, file$6, 75, 6, 2020);
    			attr_dev(div1, "class", "cntnr svelte-y5n953");
    			add_location(div1, file$6, 74, 4, 1979);
    			attr_dev(div2, "slot", "query");
    			add_location(div2, file$6, 73, 2, 1907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div0, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_query_slot$1.name,
    		type: "slot",
    		source: "(74:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let searchformclose;
    	let t0;
    	let selection_1;
    	let t1;
    	let modal_1;
    	let t2;
    	let query;
    	let current;
    	searchformclose = new SearchFormClose({ $$inline: true });
    	selection_1 = new Selection({ $$inline: true });

    	modal_1 = new Modal({
    			props: {
    				show: /*$modal*/ ctx[3],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	query = new Query$1({
    			props: {
    				options: /*queryOptions*/ ctx[2],
    				$$slots: {
    					query: [
    						create_query_slot$1,
    						({ queryResult: { data, isFetching, isError } }) => ({ 14: data, 15: isFetching, 16: isError }),
    						({ queryResult: data_data_isFetching_isFetching_isError_isError }) => [
    							(data_data_isFetching_isFetching_isError_isError
    							? 16384
    							: 0) | (data_data_isFetching_isFetching_isError_isError
    							? 32768
    							: 0) | (data_data_isFetching_isFetching_isError_isError
    							? 65536
    							: 0)
    						]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(searchformclose.$$.fragment);
    			t0 = space();
    			create_component(selection_1.$$.fragment);
    			t1 = space();
    			create_component(modal_1.$$.fragment);
    			t2 = space();
    			create_component(query.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchformclose, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(selection_1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(modal_1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(query, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const modal_1_changes = {};
    			if (dirty[0] & /*$modal*/ 8) modal_1_changes.show = /*$modal*/ ctx[3];

    			if (dirty[1] & /*$$scope*/ 16) {
    				modal_1_changes.$$scope = { dirty, ctx };
    			}

    			modal_1.$set(modal_1_changes);
    			const query_changes = {};
    			if (dirty[0] & /*queryOptions*/ 4) query_changes.options = /*queryOptions*/ ctx[2];

    			if (dirty[0] & /*isFetching, isError, data, $cols, page, $selection*/ 114707 | dirty[1] & /*$$scope*/ 16) {
    				query_changes.$$scope = { dirty, ctx };
    			}

    			query.$set(query_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchformclose.$$.fragment, local);
    			transition_in(selection_1.$$.fragment, local);
    			transition_in(modal_1.$$.fragment, local);
    			transition_in(query.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchformclose.$$.fragment, local);
    			transition_out(selection_1.$$.fragment, local);
    			transition_out(modal_1.$$.fragment, local);
    			transition_out(query.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchformclose, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(selection_1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(modal_1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(query, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let field;
    	let queryOptions;
    	let $SearchTerm;
    	let $selection;
    	let $fields;
    	let $modal;
    	let $cols;
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(9, $SearchTerm = $$value));
    	validate_store(selection, 'selection');
    	component_subscribe($$self, selection, $$value => $$invalidate(1, $selection = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(10, $fields = $$value));
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(4, $cols = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MoreFieldResult', slots, []);
    	const modal = writable(null);
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, value => $$invalidate(3, $modal = value));
    	const showModal = () => modal.set(bind(Popup));
    	let page = 1;
    	let s;
    	const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;

    	async function fetchPosts({ page = 1, s, field, $selection }) {
    		if ($selection > 0) {
    			const res = await fetch(`${url}?s=${s}&page=${page}&per_page=10&fields=${$selection}`);
    			const data = await res.json();
    			console.log(data);
    			return data;
    		} else {
    			const res = await fetch(`${url}?s=${s}&page=${page}&per_page=10&fields=${field.join(',')}`);
    			const data = await res.json();
    			return data;
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<MoreFieldResult> was created with unknown prop '${key}'`);
    	});

    	const setPage_handler = e => $$invalidate(0, page = e.detail.page);

    	$$self.$capture_state = () => ({
    		Selection,
    		SearchFormClose,
    		Query: Query$1,
    		SearchTerm,
    		selection,
    		fields,
    		LightPaginationNav,
    		cols,
    		NoResult,
    		writable,
    		Modal,
    		bind,
    		Popup,
    		modal,
    		showModal,
    		page,
    		s,
    		url,
    		fetchPosts,
    		field,
    		queryOptions,
    		$SearchTerm,
    		$selection,
    		$fields,
    		$modal,
    		$cols
    	});

    	$$self.$inject_state = $$props => {
    		if ('page' in $$props) $$invalidate(0, page = $$props.page);
    		if ('s' in $$props) $$invalidate(7, s = $$props.s);
    		if ('field' in $$props) $$invalidate(8, field = $$props.field);
    		if ('queryOptions' in $$props) $$invalidate(2, queryOptions = $$props.queryOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$SearchTerm*/ 512) {
    			$$invalidate(7, s = $SearchTerm.toLowerCase());
    		}

    		if ($$self.$$.dirty[0] & /*$fields*/ 1024) {
    			$$invalidate(8, field = $fields);
    		}

    		if ($$self.$$.dirty[0] & /*page, s, field, $selection, $SearchTerm*/ 899) {
    			$$invalidate(2, queryOptions = {
    				queryKey: ['seeMore', page, s, field, $selection],
    				queryFn: () => fetchPosts({ page, s, field, $selection }),
    				enabled: $SearchTerm !== '',
    				keepPreviousData: true,
    				cacheTime: 1000 * 60 * 5
    			});
    		}
    	};

    	return [
    		page,
    		$selection,
    		queryOptions,
    		$modal,
    		$cols,
    		modal,
    		showModal,
    		s,
    		field,
    		$SearchTerm,
    		$fields,
    		setPage_handler
    	];
    }

    class MoreFieldResult extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MoreFieldResult",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\HomeButton.svelte generated by Svelte v3.47.0 */

    const file$5 = "src\\components\\HomeButton.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let svg;
    	let style;
    	let t;
    	let g2;
    	let g0;
    	let path0;
    	let path1;
    	let rect0;
    	let rect1;
    	let path2;
    	let path3;
    	let polygon;
    	let path4;
    	let g1;
    	let path5;
    	let path6;
    	let path7;
    	let path8;
    	let path9;
    	let path10;
    	let path11;
    	let path12;
    	let path13;
    	let path14;
    	let path15;
    	let path16;
    	let path17;
    	let path18;
    	let path19;
    	let path20;
    	let path21;
    	let path22;
    	let path23;
    	let path24;
    	let path25;
    	let path26;
    	let path27;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t = text(".st0 {\r\n        fill-rule: evenodd;\r\n        clip-rule: evenodd;\r\n        fill: #ffffff;\r\n      }\r\n      .st1 {\r\n        fill-rule: evenodd;\r\n        clip-rule: evenodd;\r\n        fill: #ffca0c;\r\n      }\r\n      .st2 {\r\n        fill: #ffffff;\r\n      }\r\n    ");
    			g2 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			polygon = svg_element("polygon");
    			path4 = svg_element("path");
    			g1 = svg_element("g");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			path10 = svg_element("path");
    			path11 = svg_element("path");
    			path12 = svg_element("path");
    			path13 = svg_element("path");
    			path14 = svg_element("path");
    			path15 = svg_element("path");
    			path16 = svg_element("path");
    			path17 = svg_element("path");
    			path18 = svg_element("path");
    			path19 = svg_element("path");
    			path20 = svg_element("path");
    			path21 = svg_element("path");
    			path22 = svg_element("path");
    			path23 = svg_element("path");
    			path24 = svg_element("path");
    			path25 = svg_element("path");
    			path26 = svg_element("path");
    			path27 = svg_element("path");
    			attr_dev(style, "type", "text/css");
    			add_location(style, file$5, 33, 4, 701);
    			attr_dev(path0, "class", "st0");
    			attr_dev(path0, "d", "M7.36,10.26C6.92,9.68,6.39,9.39,5.79,9.39c-0.5,0-0.92,0.18-1.26,0.58c-0.34,0.34-0.5,0.79-0.5,1.29\r\nc0,0.5,0.16,0.94,0.47,1.29c0.31,0.37,0.73,0.55,1.23,0.55c0.66,0,1.21-0.29,1.65-0.89l0.03,1.18c-0.52,0.34-1.05,0.53-1.6,0.53\r\nc-0.76,0-1.39-0.26-1.92-0.76c-0.5-0.5-0.76-1.13-0.76-1.89c0-0.74,0.26-1.37,0.79-1.89C4.45,8.84,5.08,8.6,5.81,8.6\r\nc0.58,0,1.1,0.16,1.55,0.5V10.26z");
    			add_location(path0, file$5, 50, 8, 1025);
    			attr_dev(path1, "class", "st0");
    			attr_dev(path1, "d", "M10.8,9.39c0.5,0.03,0.89,0.18,1.21,0.53c0.29,0.34,0.45,0.79,0.45,1.29c0,0.53-0.13,0.97-0.42,1.34\r\nc-0.31,0.37-0.71,0.55-1.23,0.55v0.81c0.66-0.03,1.18-0.31,1.6-0.81v0.68h0.89V8.74H12.4v0.68c-0.45-0.5-0.97-0.79-1.6-0.81V9.39z\r\nM9.59,9.94c0.32-0.37,0.71-0.55,1.18-0.55c0.03,0,0.03,0,0.03,0V8.6c-0.03,0-0.08,0-0.1,0c-0.73,0-1.34,0.26-1.78,0.79\r\nc-0.42,0.5-0.63,1.13-0.63,1.86c0,0.73,0.21,1.34,0.63,1.84c0.47,0.55,1.05,0.81,1.76,0.81c0.05,0,0.1,0,0.13,0v-0.81l0,0\r\nc-0.52,0-0.92-0.18-1.23-0.58c-0.26-0.34-0.39-0.79-0.39-1.31C9.17,10.7,9.31,10.28,9.59,9.94z");
    			add_location(path1, file$5, 57, 8, 1461);
    			attr_dev(rect0, "x", "14.76");
    			attr_dev(rect0, "y", "4.96");
    			attr_dev(rect0, "class", "st0");
    			attr_dev(rect0, "width", "0.87");
    			attr_dev(rect0, "height", "8.82");
    			add_location(rect0, file$5, 65, 8, 2078);
    			attr_dev(rect1, "x", "17.15");
    			attr_dev(rect1, "y", "4.96");
    			attr_dev(rect1, "class", "st0");
    			attr_dev(rect1, "width", "0.87");
    			attr_dev(rect1, "height", "8.82");
    			add_location(rect1, file$5, 66, 8, 2154);
    			attr_dev(path2, "class", "st0");
    			attr_dev(path2, "d", "M21.98,9.39c0.5,0.03,0.89,0.18,1.21,0.53c0.29,0.34,0.45,0.79,0.45,1.29c0,0.53-0.16,0.97-0.42,1.34\r\nc-0.32,0.37-0.71,0.55-1.23,0.55v0.81c0.05,0,0.08,0,0.13,0c0.71,0,1.29-0.26,1.76-0.81c0.45-0.5,0.66-1.13,0.66-1.84\r\nc0-0.74-0.21-1.34-0.66-1.86c-0.45-0.53-1.05-0.79-1.76-0.79c-0.05,0-0.08,0-0.13,0V9.39z M20.77,9.94\r\nc0.31-0.37,0.71-0.55,1.18-0.55h0.03V8.6c-0.6,0.03-1.15,0.29-1.6,0.81V4.96h-0.87v8.82h0.87l0.03-0.68\r\nc0.37,0.5,0.89,0.79,1.57,0.81v-0.81l0,0c-0.53,0-0.92-0.18-1.23-0.58c-0.26-0.37-0.39-0.79-0.39-1.31\r\nC20.35,10.7,20.48,10.28,20.77,9.94z");
    			add_location(path2, file$5, 67, 8, 2230);
    			attr_dev(path3, "class", "st0");
    			attr_dev(path3, "d", "M28.12,9.39c0.52,0,0.94,0.18,1.29,0.55c0.31,0.37,0.5,0.79,0.5,1.31c0,0.5-0.18,0.94-0.5,1.29\r\nc-0.34,0.37-0.76,0.55-1.29,0.55v0.81c0.73,0,1.36-0.26,1.86-0.79c0.52-0.52,0.79-1.13,0.79-1.86c0-0.74-0.26-1.37-0.76-1.86\r\nc-0.52-0.53-1.15-0.79-1.89-0.79V9.39z M26.86,9.94c0.34-0.37,0.76-0.55,1.26-0.55V8.6c-0.71,0-1.34,0.26-1.86,0.76\r\nc-0.5,0.52-0.76,1.15-0.76,1.89c0,0.73,0.26,1.36,0.76,1.86c0.52,0.53,1.15,0.79,1.86,0.79v-0.81c-0.5,0-0.92-0.18-1.26-0.52\r\nc-0.34-0.37-0.5-0.79-0.5-1.31C26.36,10.73,26.52,10.28,26.86,9.94z");
    			add_location(path3, file$5, 76, 8, 2846);
    			attr_dev(polygon, "class", "st0");
    			attr_dev(polygon, "points", "31.17,8.74 32.22,8.74 33.53,10.44 34.84,8.74 35.92,8.74 34.08,11.1 36.18,13.77 35.1,13.77 \r\n33.53,11.73 31.95,13.77 30.85,13.77 32.98,11.1 \t\t");
    			add_location(polygon, file$5, 84, 8, 3427);
    			attr_dev(path4, "class", "st1");
    			attr_dev(path4, "d", "M27.68,1.65l-2.97,2.99l0.89,0.87c0,0,1.86-1.89,2.52-2.52c0.63,0.63,2.52,2.52,2.52,2.52l0.87-0.87\r\nL28.12,1.2L27.68,1.65z");
    			add_location(path4, file$5, 89, 8, 3642);
    			add_location(g0, file$5, 49, 6, 1012);
    			attr_dev(path5, "class", "st2");
    			attr_dev(path5, "d", "M3.29,18.77l0.3-1.44h0.19l-0.27,1.28h0.75l-0.03,0.16H3.29z");
    			add_location(path5, file$5, 96, 8, 3851);
    			attr_dev(path6, "class", "st2");
    			attr_dev(path6, "d", "M4.44,18.77l0.3-1.44h1.04L5.74,17.5H4.9L4.8,17.94h0.82l-0.03,0.16H4.77l-0.1,0.5h0.91l-0.03,0.16H4.44z");
    			add_location(path6, file$5, 100, 8, 3975);
    			attr_dev(path7, "class", "st2");
    			attr_dev(path7, "d", "M5.67,18.77l0.82-1.44h0.23l0.24,1.44H6.76l-0.07-0.41H6.11l-0.23,0.41H5.67z M6.19,18.21h0.48l-0.06-0.36\r\nc-0.02-0.14-0.03-0.26-0.04-0.36c-0.03,0.08-0.08,0.18-0.14,0.29L6.19,18.21z");
    			add_location(path7, file$5, 104, 8, 4142);
    			attr_dev(path8, "class", "st2");
    			attr_dev(path8, "d", "M7.16,18.77l0.3-1.44h0.43c0.1,0,0.18,0.01,0.24,0.02c0.08,0.02,0.15,0.06,0.2,0.11\r\nc0.06,0.05,0.1,0.12,0.13,0.19c0.03,0.08,0.04,0.17,0.04,0.26c0,0.12-0.02,0.22-0.05,0.32c-0.03,0.1-0.08,0.18-0.14,0.25\r\nc-0.06,0.07-0.12,0.13-0.18,0.17C8.07,18.7,8,18.73,7.91,18.75c-0.06,0.02-0.14,0.02-0.24,0.02H7.16z M7.38,18.61h0.23\r\nc0.1,0,0.19-0.01,0.27-0.03c0.05-0.01,0.09-0.03,0.13-0.05c0.05-0.03,0.09-0.07,0.13-0.12c0.05-0.06,0.09-0.14,0.12-0.22\r\nc0.03-0.08,0.04-0.18,0.04-0.28c0-0.12-0.02-0.21-0.06-0.27c-0.04-0.06-0.09-0.1-0.16-0.12C8.04,17.5,7.97,17.5,7.87,17.5H7.62\r\nL7.38,18.61z");
    			add_location(path8, file$5, 109, 8, 4386);
    			attr_dev(path9, "class", "st2");
    			attr_dev(path9, "d", "M9.21,18.77l0.3-1.44h0.24l0.15,0.93c0.02,0.12,0.03,0.24,0.04,0.35c0.04-0.1,0.11-0.23,0.2-0.39l0.5-0.89\r\nh0.24l-0.3,1.44h-0.19l0.15-0.7c0.03-0.16,0.08-0.34,0.15-0.54c-0.04,0.09-0.09,0.19-0.15,0.3l-0.54,0.94H9.81l-0.14-0.92\r\nc-0.01-0.08-0.02-0.18-0.03-0.3c-0.02,0.13-0.03,0.23-0.05,0.3l-0.19,0.92H9.21z");
    			add_location(path9, file$5, 118, 8, 5022);
    			attr_dev(path10, "class", "st2");
    			attr_dev(path10, "d", "M10.77,18.77l0.82-1.44h0.23l0.24,1.44h-0.19l-0.07-0.41h-0.58l-0.23,0.41H10.77z M11.3,18.21h0.48\r\nl-0.06-0.36c-0.02-0.14-0.03-0.26-0.04-0.36c-0.03,0.08-0.08,0.18-0.14,0.29L11.3,18.21z");
    			add_location(path10, file$5, 124, 8, 5388);
    			attr_dev(path11, "class", "st2");
    			attr_dev(path11, "d", "M12.27,18.77l0.3-1.44h0.19L13,17.87c0.07,0.16,0.13,0.3,0.18,0.42c0.02,0.07,0.05,0.15,0.09,0.26\r\nc0.02-0.12,0.04-0.25,0.07-0.37l0.18-0.85h0.19l-0.3,1.44H13.2l-0.36-0.83c-0.06-0.15-0.11-0.28-0.15-0.39\r\nc-0.01,0.09-0.03,0.21-0.06,0.34l-0.18,0.87H12.27z");
    			add_location(path11, file$5, 129, 8, 5636);
    			attr_dev(path12, "class", "st2");
    			attr_dev(path12, "d", "M13.6,18.77l0.82-1.44h0.23l0.24,1.44H14.7l-0.07-0.41h-0.58l-0.23,0.41H13.6z M14.13,18.21h0.48l-0.06-0.36\r\nc-0.02-0.14-0.03-0.26-0.04-0.36c-0.03,0.08-0.08,0.18-0.14,0.29L14.13,18.21z");
    			add_location(path12, file$5, 135, 8, 5951);
    			attr_dev(path13, "class", "st2");
    			attr_dev(path13, "d", "M15.83,18.2l0.03-0.16h0.63l-0.12,0.59c-0.08,0.05-0.17,0.09-0.27,0.12c-0.1,0.03-0.2,0.05-0.3,0.05\r\nc-0.21,0-0.37-0.06-0.47-0.19c-0.09-0.11-0.13-0.24-0.13-0.41c0-0.17,0.04-0.33,0.11-0.47c0.08-0.14,0.17-0.25,0.29-0.31\r\nc0.12-0.07,0.25-0.1,0.39-0.1c0.1,0,0.19,0.02,0.27,0.06c0.08,0.04,0.14,0.09,0.19,0.15c0.04,0.06,0.07,0.14,0.09,0.24l-0.19,0.02\r\nc-0.02-0.1-0.06-0.17-0.13-0.23c-0.06-0.05-0.15-0.08-0.25-0.08c-0.1,0-0.2,0.03-0.29,0.08c-0.09,0.06-0.16,0.14-0.22,0.26\r\nc-0.05,0.11-0.08,0.24-0.08,0.39c0,0.14,0.04,0.25,0.11,0.33c0.07,0.07,0.17,0.11,0.3,0.11c0.12,0,0.26-0.04,0.4-0.12l0.06-0.31\r\nH15.83z");
    			add_location(path13, file$5, 140, 8, 6198);
    			attr_dev(path14, "class", "st2");
    			attr_dev(path14, "d", "M16.68,18.77l0.3-1.44h1.04l-0.03,0.16h-0.85l-0.09,0.45h0.82l-0.03,0.16h-0.82l-0.1,0.5h0.91l-0.03,0.16\r\nH16.68z");
    			add_location(path14, file$5, 149, 8, 6859);
    			attr_dev(path15, "class", "st2");
    			attr_dev(path15, "d", "M18.04,18.77l0.3-1.44h0.24l0.15,0.93c0.02,0.12,0.03,0.24,0.04,0.35c0.04-0.1,0.11-0.23,0.2-0.39l0.5-0.89\r\nh0.24l-0.3,1.44h-0.19l0.15-0.7c0.03-0.16,0.08-0.34,0.15-0.54c-0.04,0.09-0.09,0.19-0.15,0.3l-0.54,0.94h-0.19l-0.14-0.92\r\nc-0.01-0.08-0.02-0.18-0.03-0.3c-0.02,0.13-0.03,0.23-0.05,0.3l-0.19,0.92H18.04z");
    			add_location(path15, file$5, 154, 8, 7035);
    			attr_dev(path16, "class", "st2");
    			attr_dev(path16, "d", "M19.73,18.77l0.3-1.44h1.04l-0.03,0.16h-0.85l-0.09,0.45h0.82l-0.03,0.16h-0.82l-0.1,0.5h0.91l-0.03,0.16\r\nH19.73z");
    			add_location(path16, file$5, 160, 8, 7404);
    			attr_dev(path17, "class", "st2");
    			attr_dev(path17, "d", "M21.1,18.77l0.3-1.44h0.19l0.24,0.54c0.07,0.16,0.13,0.3,0.18,0.42c0.02,0.07,0.05,0.15,0.09,0.26\r\nc0.02-0.12,0.04-0.25,0.07-0.37l0.18-0.85h0.19l-0.3,1.44h-0.19l-0.36-0.83c-0.06-0.15-0.11-0.28-0.15-0.39\r\nc-0.01,0.09-0.03,0.21-0.06,0.34l-0.18,0.87H21.1z");
    			add_location(path17, file$5, 165, 8, 7580);
    			attr_dev(path18, "class", "st2");
    			attr_dev(path18, "d", "M22.93,18.77l0.27-1.27h-0.47l0.03-0.16h1.13l-0.03,0.16h-0.47l-0.27,1.27H22.93z");
    			add_location(path18, file$5, 171, 8, 7895);
    			attr_dev(path19, "class", "st2");
    			attr_dev(path19, "d", "M24.44,18.31l0.19-0.02l0,0.05c0,0.06,0.01,0.11,0.04,0.15c0.03,0.05,0.07,0.08,0.13,0.11\r\nc0.06,0.03,0.13,0.04,0.21,0.04c0.12,0,0.2-0.03,0.26-0.08c0.06-0.05,0.09-0.11,0.09-0.17c0-0.05-0.02-0.09-0.05-0.12\r\nc-0.03-0.04-0.12-0.09-0.27-0.15c-0.11-0.05-0.19-0.09-0.23-0.11c-0.06-0.04-0.11-0.09-0.14-0.14c-0.03-0.05-0.05-0.11-0.05-0.17\r\nc0-0.07,0.02-0.14,0.06-0.2c0.04-0.06,0.1-0.1,0.18-0.14c0.08-0.03,0.17-0.05,0.26-0.05c0.12,0,0.22,0.02,0.3,0.06\r\nc0.08,0.04,0.14,0.09,0.18,0.16c0.04,0.07,0.05,0.13,0.05,0.19c0,0.01,0,0.02,0,0.03l-0.19,0.01c0-0.04,0-0.07-0.01-0.1\r\nc-0.01-0.04-0.03-0.07-0.06-0.1c-0.03-0.03-0.07-0.05-0.11-0.07c-0.05-0.02-0.1-0.03-0.16-0.03c-0.1,0-0.19,0.02-0.24,0.07\r\nc-0.04,0.04-0.07,0.08-0.07,0.14c0,0.04,0.01,0.07,0.03,0.09c0.02,0.03,0.05,0.06,0.1,0.08c0.03,0.02,0.11,0.06,0.24,0.11\r\nc0.1,0.05,0.17,0.08,0.21,0.11c0.05,0.03,0.09,0.08,0.12,0.13c0.03,0.05,0.04,0.11,0.04,0.17c0,0.08-0.02,0.15-0.07,0.22\r\nc-0.05,0.07-0.11,0.12-0.2,0.15c-0.08,0.04-0.18,0.05-0.29,0.05c-0.16,0-0.3-0.04-0.4-0.11C24.49,18.62,24.44,18.49,24.44,18.31z");
    			add_location(path19, file$5, 175, 8, 8039);
    			attr_dev(path20, "class", "st2");
    			attr_dev(path20, "d", "M25.84,18.17c0-0.26,0.07-0.46,0.22-0.62c0.15-0.16,0.33-0.24,0.54-0.24c0.18,0,0.33,0.06,0.44,0.18\r\nc0.11,0.12,0.17,0.27,0.17,0.47c0,0.14-0.03,0.27-0.09,0.39c-0.04,0.09-0.1,0.17-0.16,0.23c-0.06,0.07-0.13,0.12-0.21,0.15\r\nc-0.1,0.05-0.2,0.07-0.31,0.07c-0.12,0-0.22-0.03-0.31-0.08c-0.09-0.05-0.17-0.13-0.21-0.23C25.87,18.38,25.84,18.28,25.84,18.17z\r\nM26.03,18.18c0,0.08,0.02,0.16,0.05,0.23c0.03,0.07,0.09,0.13,0.16,0.17c0.07,0.04,0.14,0.06,0.22,0.06\r\nc0.07,0,0.14-0.02,0.21-0.05c0.07-0.03,0.13-0.08,0.18-0.15c0.05-0.06,0.09-0.14,0.12-0.23c0.03-0.09,0.05-0.18,0.05-0.27\r\nc0-0.14-0.04-0.26-0.12-0.34c-0.08-0.09-0.18-0.13-0.3-0.13c-0.15,0-0.28,0.06-0.4,0.19C26.09,17.79,26.03,17.96,26.03,18.18z");
    			add_location(path20, file$5, 187, 8, 9144);
    			attr_dev(path21, "class", "st2");
    			attr_dev(path21, "d", "M27.32,18.77l0.3-1.44h0.19l-0.27,1.28h0.75l-0.03,0.16H27.32z");
    			add_location(path21, file$5, 196, 8, 9896);
    			attr_dev(path22, "class", "st2");
    			attr_dev(path22, "d", "M28.78,17.33h0.19l-0.18,0.88c-0.02,0.07-0.02,0.13-0.02,0.16c0,0.08,0.03,0.14,0.09,0.19\r\nc0.06,0.05,0.14,0.07,0.23,0.07c0.07,0,0.14-0.02,0.2-0.05c0.06-0.03,0.11-0.08,0.15-0.15c0.04-0.07,0.07-0.17,0.1-0.31l0.17-0.79\r\nh0.19l-0.18,0.84c-0.03,0.14-0.07,0.26-0.12,0.34c-0.05,0.08-0.12,0.15-0.2,0.2c-0.09,0.05-0.19,0.08-0.3,0.08\r\nc-0.11,0-0.2-0.02-0.28-0.05c-0.08-0.04-0.14-0.09-0.18-0.15c-0.04-0.06-0.06-0.14-0.06-0.22c0-0.05,0.01-0.14,0.04-0.26\r\nL28.78,17.33z");
    			add_location(path22, file$5, 200, 8, 10022);
    			attr_dev(path23, "class", "st2");
    			attr_dev(path23, "d", "M30.31,18.77l0.27-1.27H30.1l0.03-0.16h1.13l-0.03,0.16h-0.47l-0.27,1.27H30.31z");
    			add_location(path23, file$5, 208, 8, 10542);
    			attr_dev(path24, "class", "st2");
    			attr_dev(path24, "d", "M31.21,18.77l0.3-1.44h0.19l-0.3,1.44H31.21z");
    			add_location(path24, file$5, 212, 8, 10685);
    			attr_dev(path25, "class", "st2");
    			attr_dev(path25, "d", "M31.86,18.17c0-0.26,0.07-0.46,0.22-0.62c0.15-0.16,0.33-0.24,0.54-0.24c0.18,0,0.33,0.06,0.44,0.18\r\nc0.11,0.12,0.17,0.27,0.17,0.47c0,0.14-0.03,0.27-0.09,0.39c-0.04,0.09-0.1,0.17-0.16,0.23c-0.06,0.07-0.13,0.12-0.21,0.15\r\nc-0.1,0.05-0.2,0.07-0.31,0.07c-0.12,0-0.22-0.03-0.31-0.08c-0.09-0.05-0.17-0.13-0.21-0.23C31.88,18.38,31.86,18.28,31.86,18.17z\r\nM32.05,18.18c0,0.08,0.02,0.16,0.05,0.23s0.09,0.13,0.16,0.17c0.07,0.04,0.14,0.06,0.22,0.06c0.07,0,0.14-0.02,0.21-0.05\r\nc0.07-0.03,0.13-0.08,0.18-0.15c0.05-0.06,0.09-0.14,0.12-0.23c0.03-0.09,0.05-0.18,0.05-0.27c0-0.14-0.04-0.26-0.12-0.34\r\nc-0.08-0.09-0.18-0.13-0.3-0.13c-0.15,0-0.28,0.06-0.4,0.19C32.11,17.79,32.05,17.96,32.05,18.18z");
    			add_location(path25, file$5, 213, 8, 10763);
    			attr_dev(path26, "class", "st2");
    			attr_dev(path26, "d", "M33.36,18.77l0.3-1.44h0.19l0.24,0.54c0.07,0.16,0.13,0.3,0.18,0.42c0.02,0.07,0.05,0.15,0.09,0.26\r\nc0.02-0.12,0.04-0.25,0.07-0.37l0.18-0.85h0.19l-0.3,1.44h-0.19l-0.36-0.83c-0.06-0.15-0.11-0.28-0.15-0.39\r\nc-0.01,0.09-0.03,0.21-0.06,0.34l-0.18,0.87H33.36z");
    			add_location(path26, file$5, 222, 8, 11505);
    			attr_dev(path27, "class", "st2");
    			attr_dev(path27, "d", "M34.87,18.31l0.19-0.02l0,0.05c0,0.06,0.01,0.11,0.04,0.15c0.03,0.05,0.07,0.08,0.13,0.11\r\nc0.06,0.03,0.13,0.04,0.21,0.04c0.12,0,0.2-0.03,0.26-0.08c0.06-0.05,0.09-0.11,0.09-0.17c0-0.05-0.02-0.09-0.05-0.12\r\nc-0.03-0.04-0.12-0.09-0.27-0.15c-0.11-0.05-0.19-0.09-0.23-0.11c-0.06-0.04-0.11-0.09-0.14-0.14c-0.03-0.05-0.05-0.11-0.05-0.17\r\nc0-0.07,0.02-0.14,0.06-0.2c0.04-0.06,0.1-0.1,0.18-0.14c0.08-0.03,0.17-0.05,0.26-0.05c0.12,0,0.22,0.02,0.3,0.06\r\ns0.14,0.09,0.18,0.16c0.04,0.07,0.05,0.13,0.05,0.19c0,0.01,0,0.02,0,0.03l-0.19,0.01c0-0.04,0-0.07-0.01-0.1\r\nc-0.01-0.04-0.03-0.07-0.06-0.1c-0.03-0.03-0.07-0.05-0.11-0.07c-0.05-0.02-0.1-0.03-0.16-0.03c-0.1,0-0.19,0.02-0.24,0.07\r\nc-0.04,0.04-0.07,0.08-0.07,0.14c0,0.04,0.01,0.07,0.03,0.09c0.02,0.03,0.05,0.06,0.1,0.08c0.03,0.02,0.11,0.06,0.24,0.11\r\nc0.1,0.05,0.17,0.08,0.21,0.11c0.05,0.03,0.09,0.08,0.12,0.13c0.03,0.05,0.04,0.11,0.04,0.17c0,0.08-0.02,0.15-0.07,0.22\r\nc-0.05,0.07-0.11,0.12-0.2,0.15c-0.08,0.04-0.18,0.05-0.29,0.05c-0.16,0-0.3-0.04-0.4-0.11C34.92,18.62,34.87,18.49,34.87,18.31z");
    			add_location(path27, file$5, 228, 8, 11822);
    			add_location(g1, file$5, 95, 6, 3838);
    			add_location(g2, file$5, 48, 4, 1001);
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "id", "Layer_1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "height", "80");
    			attr_dev(svg, "width", "150");
    			attr_dev(svg, "viewBox", "0 0 40 20");
    			set_style(svg, "enable-background", "new 0 0 40 20");
    			attr_dev(svg, "xml:space", "preserve");
    			add_location(svg, file$5, 22, 2, 430);
    			attr_dev(button, "class", "homebutton svelte-357yf7");
    			add_location(button, file$5, 21, 0, 372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, style);
    			append_dev(style, t);
    			append_dev(svg, g2);
    			append_dev(g2, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    			append_dev(g0, rect0);
    			append_dev(g0, rect1);
    			append_dev(g0, path2);
    			append_dev(g0, path3);
    			append_dev(g0, polygon);
    			append_dev(g0, path4);
    			append_dev(g2, g1);
    			append_dev(g1, path5);
    			append_dev(g1, path6);
    			append_dev(g1, path7);
    			append_dev(g1, path8);
    			append_dev(g1, path9);
    			append_dev(g1, path10);
    			append_dev(g1, path11);
    			append_dev(g1, path12);
    			append_dev(g1, path13);
    			append_dev(g1, path14);
    			append_dev(g1, path15);
    			append_dev(g1, path16);
    			append_dev(g1, path17);
    			append_dev(g1, path18);
    			append_dev(g1, path19);
    			append_dev(g1, path20);
    			append_dev(g1, path21);
    			append_dev(g1, path22);
    			append_dev(g1, path23);
    			append_dev(g1, path24);
    			append_dev(g1, path25);
    			append_dev(g1, path26);
    			append_dev(g1, path27);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $viewfield;
    	let $MoreField;
    	let $fields;
    	let $seeMore;
    	let $SearchTerm;
    	let $isSearching;
    	validate_store(viewfield, 'viewfield');
    	component_subscribe($$self, viewfield, $$value => $$invalidate(2, $viewfield = $$value));
    	validate_store(MoreField, 'MoreField');
    	component_subscribe($$self, MoreField, $$value => $$invalidate(3, $MoreField = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(4, $fields = $$value));
    	validate_store(seeMore, 'seeMore');
    	component_subscribe($$self, seeMore, $$value => $$invalidate(5, $seeMore = $$value));
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(6, $SearchTerm = $$value));
    	validate_store(isSearching, 'isSearching');
    	component_subscribe($$self, isSearching, $$value => $$invalidate(7, $isSearching = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HomeButton', slots, []);

    	function onClick() {
    		set_store_value(isSearching, $isSearching = false, $isSearching);
    		set_store_value(SearchTerm, $SearchTerm = '', $SearchTerm);
    		set_store_value(seeMore, $seeMore = false, $seeMore);
    		set_store_value(fields, $fields = '', $fields);
    		set_store_value(MoreField, $MoreField = false, $MoreField);
    		set_store_value(viewfield, $viewfield = false, $viewfield);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HomeButton> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => onClick();

    	$$self.$capture_state = () => ({
    		HomeButton: HomeButton_1,
    		isSearching,
    		SearchTerm,
    		seeMore,
    		fields,
    		MoreField,
    		viewfield,
    		onClick,
    		$viewfield,
    		$MoreField,
    		$fields,
    		$seeMore,
    		$SearchTerm,
    		$isSearching
    	});

    	return [onClick, click_handler];
    }

    class HomeButton_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HomeButton_1",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\SearchResult.svelte generated by Svelte v3.47.0 */
    const file$4 = "src\\components\\SearchResult.svelte";

    // (52:0) {#if $fieldID > 0}
    function create_if_block_3(ctx) {
    	let modal_1;
    	let current;

    	modal_1 = new Modal$1({
    			props: {
    				show: /*modal*/ ctx[8].set(bind$1(ViewResult))
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(modal_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(modal_1, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(modal_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(modal_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(modal_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(52:0) {#if $fieldID > 0}",
    		ctx
    	});

    	return block;
    }

    // (57:4) <Modal show={$modal}>
    function create_default_slot$1(ctx) {
    	let button;
    	let svg;
    	let path;
    	let t0;
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			span = element("span");
    			span.textContent = "Edit Columns";
    			attr_dev(path, "d", "M9 39H11.2L35.45 14.75L34.35 13.65L33.25 12.55L9 36.8ZM6 42V35.6L35.4 6.2Q36.25 5.35 37.525 5.375Q38.8 5.4 39.65 6.25L41.8 8.4Q42.65 9.25 42.65 10.5Q42.65 11.75 41.8 12.6L12.4 42ZM39.5 10.45 37.45 8.4ZM35.45 14.75 34.35 13.65 33.25 12.55 35.45 14.75Z");
    			add_location(path, file$4, 64, 11, 1787);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#014e89");
    			attr_dev(svg, "height", "30");
    			attr_dev(svg, "width", "35");
    			attr_dev(svg, "viewBox", "-5 7 55 35");
    			add_location(svg, file$4, 58, 8, 1621);
    			attr_dev(span, "class", "modal-text svelte-121c1xl");
    			add_location(span, file$4, 68, 8, 2100);
    			attr_dev(button, "class", "modal-button svelte-121c1xl");
    			add_location(button, file$4, 57, 6, 1561);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(button, t0);
    			append_dev(button, span);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*showModal*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(57:4) <Modal show={$modal}>",
    		ctx
    	});

    	return block;
    }

    // (91:33) 
    function create_if_block_2$1(ctx) {
    	let h2;
    	let t1;
    	let div1;
    	let div0;
    	let table;
    	let t2;
    	let div2;
    	let lightpaginationnav;
    	let current;
    	let mounted;
    	let dispose;

    	table = new Table({
    			props: {
    				tableData: /*data*/ ctx[19],
    				tableheaderData: col,
    				tableheader: /*$cols*/ ctx[6]
    			},
    			$$inline: true
    		});

    	lightpaginationnav = new LightPaginationNav({
    			props: {
    				totalItems: /*data*/ ctx[19][0].total,
    				pageSize: 10,
    				currentPage: /*$pages*/ ctx[0],
    				limit: 1
    			},
    			$$inline: true
    		});

    	lightpaginationnav.$on("setPage", /*setPage_handler*/ ctx[14]);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Case Studies";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(table.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(lightpaginationnav.$$.fragment);
    			attr_dev(h2, "class", "table-label svelte-121c1xl");
    			add_location(h2, file$4, 91, 12, 2856);
    			attr_dev(div0, "class", "table-wrapper svelte-121c1xl");
    			toggle_class(div0, "tableScrolled", /*yTop*/ ctx[2] > 50);
    			add_location(div0, file$4, 93, 14, 2956);
    			attr_dev(div1, "class", "table-container svelte-121c1xl");
    			add_location(div1, file$4, 92, 12, 2911);
    			attr_dev(div2, "class", "area-2 svelte-121c1xl");
    			add_location(div2, file$4, 110, 12, 3484);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(table, div0, null);
    			/*div0_binding_1*/ ctx[13](div0);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(lightpaginationnav, div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "scroll", /*parseScroll*/ ctx[9], false, false, false),
    					listen_dev(div0, "mousemove", /*parseScroll*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const table_changes = {};
    			if (dirty & /*data*/ 524288) table_changes.tableData = /*data*/ ctx[19];
    			if (dirty & /*$cols*/ 64) table_changes.tableheader = /*$cols*/ ctx[6];
    			table.$set(table_changes);

    			if (dirty & /*yTop*/ 4) {
    				toggle_class(div0, "tableScrolled", /*yTop*/ ctx[2] > 50);
    			}

    			const lightpaginationnav_changes = {};
    			if (dirty & /*data*/ 524288) lightpaginationnav_changes.totalItems = /*data*/ ctx[19][0].total;
    			if (dirty & /*$pages*/ 1) lightpaginationnav_changes.currentPage = /*$pages*/ ctx[0];
    			lightpaginationnav.$set(lightpaginationnav_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(lightpaginationnav.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(lightpaginationnav.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(table);
    			/*div0_binding_1*/ ctx[13](null);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			destroy_component(lightpaginationnav);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(91:33) ",
    		ctx
    	});

    	return block;
    }

    // (89:28) 
    function create_if_block_1$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Error";
    			add_location(span, file$4, 89, 12, 2789);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(89:28) ",
    		ctx
    	});

    	return block;
    }

    // (77:10) {#if isFetching}
    function create_if_block$1(ctx) {
    	let div1;
    	let div0;
    	let tableloading;
    	let current;
    	let mounted;
    	let dispose;
    	tableloading = new TableLoading({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(tableloading.$$.fragment);
    			attr_dev(div0, "class", "table-wrapper svelte-121c1xl");
    			toggle_class(div0, "tableScrolled", /*yTop*/ ctx[2] > 45);
    			add_location(div0, file$4, 78, 14, 2442);
    			attr_dev(div1, "class", "loading svelte-121c1xl");
    			add_location(div1, file$4, 77, 12, 2405);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(tableloading, div0, null);
    			/*div0_binding*/ ctx[12](div0);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "scroll", /*parseScroll*/ ctx[9], false, false, false),
    					listen_dev(div0, "mousemove", /*parseScroll*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*yTop*/ 4) {
    				toggle_class(div0, "tableScrolled", /*yTop*/ ctx[2] > 45);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tableloading.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tableloading.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(tableloading);
    			/*div0_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(77:10) {#if isFetching}",
    		ctx
    	});

    	return block;
    }

    // (74:4) 
    function create_query_slot(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isFetching*/ ctx[20]) return 0;
    		if (/*isError*/ ctx[21]) return 1;
    		if (/*data*/ ctx[19]?.length) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "results svelte-fhxlyi");
    			add_location(div0, file$4, 75, 8, 2328);
    			attr_dev(div1, "class", "cntnr");
    			add_location(div1, file$4, 74, 6, 2299);
    			attr_dev(div2, "slot", "query");
    			add_location(div2, file$4, 73, 4, 2225);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_query_slot.name,
    		type: "slot",
    		source: "(74:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let modal_1;
    	let t1;
    	let query;
    	let current;
    	let if_block = /*$fieldID*/ ctx[4] > 0 && create_if_block_3(ctx);

    	modal_1 = new Modal$1({
    			props: {
    				show: /*$modal*/ ctx[5],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	query = new Query$1({
    			props: {
    				options: /*queryOptions*/ ctx[3],
    				$$slots: {
    					query: [
    						create_query_slot,
    						({ queryResult: { data, isFetching, isError } }) => ({ 19: data, 20: isFetching, 21: isError }),
    						({ queryResult: data_data_isFetching_isFetching_isError_isError }) => (data_data_isFetching_isFetching_isError_isError
    						? 524288
    						: 0) | (data_data_isFetching_isFetching_isError_isError
    						? 1048576
    						: 0) | (data_data_isFetching_isFetching_isError_isError
    						? 2097152
    						: 0)
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(modal_1.$$.fragment);
    			t1 = space();
    			create_component(query.$$.fragment);
    			attr_dev(div0, "id", "selection");
    			attr_dev(div0, "class", "modal svelte-121c1xl");
    			add_location(div0, file$4, 55, 2, 1492);
    			attr_dev(div1, "class", "top-wrapper svelte-121c1xl");
    			add_location(div1, file$4, 54, 0, 1463);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(modal_1, div0, null);
    			append_dev(div1, t1);
    			mount_component(query, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$fieldID*/ ctx[4] > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$fieldID*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const modal_1_changes = {};
    			if (dirty & /*$modal*/ 32) modal_1_changes.show = /*$modal*/ ctx[5];

    			if (dirty & /*$$scope*/ 4194304) {
    				modal_1_changes.$$scope = { dirty, ctx };
    			}

    			modal_1.$set(modal_1_changes);
    			const query_changes = {};
    			if (dirty & /*queryOptions*/ 8) query_changes.options = /*queryOptions*/ ctx[3];

    			if (dirty & /*$$scope, box, yTop, isFetching, isError, data, $pages, $cols*/ 7864391) {
    				query_changes.$$scope = { dirty, ctx };
    			}

    			query.$set(query_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(modal_1.$$.fragment, local);
    			transition_in(query.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(modal_1.$$.fragment, local);
    			transition_out(query.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(modal_1);
    			destroy_component(query);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let queryOptions;
    	let $pages;
    	let $SearchTerm;
    	let $fieldID;
    	let $modal;
    	let $cols;
    	validate_store(pages, 'pages');
    	component_subscribe($$self, pages, $$value => $$invalidate(0, $pages = $$value));
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(11, $SearchTerm = $$value));
    	validate_store(fieldID, 'fieldID');
    	component_subscribe($$self, fieldID, $$value => $$invalidate(4, $fieldID = $$value));
    	validate_store(cols, 'cols');
    	component_subscribe($$self, cols, $$value => $$invalidate(6, $cols = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchResult', slots, []);
    	const showModal = () => modal.set(bind$1(Popup));
    	const modal = writable(null);
    	validate_store(modal, 'modal');
    	component_subscribe($$self, modal, value => $$invalidate(5, $modal = value));
    	const url = `https://www.callboxinc.com/wp-json/cbtk/v1/case-studies`;
    	let s;

    	async function fetchPosts($pages, s) {
    		const data = await fetch(`${url}?s=${s}&page=${$pages}&per_page=10&fields=7
      `).then(res => res.json());

    		return data;
    	}

    	let box;
    	let yTop = 0;
    	let yHeight;
    	let yScroll;

    	function parseScroll() {
    		$$invalidate(2, yTop = box.scrollTop);
    		yHeight = box.clientHeight;
    		yScroll = box.scrollHeight;
    	}

    	onMount(async () => parseScroll());
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchResult> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			box = $$value;
    			$$invalidate(1, box);
    		});
    	}

    	function div0_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			box = $$value;
    			$$invalidate(1, box);
    		});
    	}

    	const setPage_handler = e => set_store_value(pages, $pages = e.detail.page, $pages);

    	$$self.$capture_state = () => ({
    		Query: Query$1,
    		Table,
    		LightPaginationNav,
    		TableLoading,
    		cols,
    		pages,
    		fieldID,
    		SearchTerm,
    		col,
    		Modal: Modal$1,
    		bind: bind$1,
    		writable,
    		ViewResult,
    		Popup,
    		showModal,
    		modal,
    		url,
    		s,
    		fetchPosts,
    		onMount,
    		box,
    		yTop,
    		yHeight,
    		yScroll,
    		parseScroll,
    		queryOptions,
    		$pages,
    		$SearchTerm,
    		$fieldID,
    		$modal,
    		$cols
    	});

    	$$self.$inject_state = $$props => {
    		if ('s' in $$props) $$invalidate(10, s = $$props.s);
    		if ('box' in $$props) $$invalidate(1, box = $$props.box);
    		if ('yTop' in $$props) $$invalidate(2, yTop = $$props.yTop);
    		if ('yHeight' in $$props) yHeight = $$props.yHeight;
    		if ('yScroll' in $$props) yScroll = $$props.yScroll;
    		if ('queryOptions' in $$props) $$invalidate(3, queryOptions = $$props.queryOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$SearchTerm*/ 2048) {
    			$$invalidate(10, s = $SearchTerm.toLowerCase());
    		}

    		if ($$self.$$.dirty & /*$pages, s*/ 1025) {
    			$$invalidate(3, queryOptions = {
    				queryKey: ['posts', $pages, s],
    				queryFn: () => fetchPosts($pages, s),
    				keepPreviousData: true,
    				staleTime: Infinity,
    				cacheTime: 1000 * 60 * 5
    			});
    		}
    	};

    	return [
    		$pages,
    		box,
    		yTop,
    		queryOptions,
    		$fieldID,
    		$modal,
    		$cols,
    		showModal,
    		modal,
    		parseScroll,
    		s,
    		$SearchTerm,
    		div0_binding,
    		div0_binding_1,
    		setPage_handler
    	];
    }

    class SearchResult extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchResult",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\Dashboard.svelte generated by Svelte v3.47.0 */

    const file$3 = "src\\components\\Dashboard.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let svg;
    	let style;
    	let t;
    	let g2;
    	let g0;
    	let path0;
    	let path1;
    	let rect0;
    	let rect1;
    	let path2;
    	let path3;
    	let polygon;
    	let path4;
    	let g1;
    	let path5;
    	let path6;
    	let path7;
    	let path8;
    	let path9;
    	let path10;
    	let path11;
    	let path12;
    	let path13;
    	let path14;
    	let path15;
    	let path16;
    	let path17;
    	let path18;
    	let path19;
    	let path20;
    	let path21;
    	let path22;
    	let path23;
    	let path24;
    	let path25;
    	let path26;
    	let path27;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			style = svg_element("style");
    			t = text(".st0 {\r\n        fill-rule: evenodd;\r\n        clip-rule: evenodd;\r\n        fill: #ffffff;\r\n      }\r\n      .st1 {\r\n        fill-rule: evenodd;\r\n        clip-rule: evenodd;\r\n        fill: #ffca0c;\r\n      }\r\n      .st2 {\r\n        fill: #ffffff;\r\n      }\r\n    ");
    			g2 = svg_element("g");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			polygon = svg_element("polygon");
    			path4 = svg_element("path");
    			g1 = svg_element("g");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			path10 = svg_element("path");
    			path11 = svg_element("path");
    			path12 = svg_element("path");
    			path13 = svg_element("path");
    			path14 = svg_element("path");
    			path15 = svg_element("path");
    			path16 = svg_element("path");
    			path17 = svg_element("path");
    			path18 = svg_element("path");
    			path19 = svg_element("path");
    			path20 = svg_element("path");
    			path21 = svg_element("path");
    			path22 = svg_element("path");
    			path23 = svg_element("path");
    			path24 = svg_element("path");
    			path25 = svg_element("path");
    			path26 = svg_element("path");
    			path27 = svg_element("path");
    			attr_dev(style, "type", "text/css");
    			add_location(style, file$3, 32, 4, 652);
    			attr_dev(path0, "class", "st0");
    			attr_dev(path0, "d", "M7.36,10.26C6.92,9.68,6.39,9.39,5.79,9.39c-0.5,0-0.92,0.18-1.26,0.58c-0.34,0.34-0.5,0.79-0.5,1.29\r\n  c0,0.5,0.16,0.94,0.47,1.29c0.31,0.37,0.73,0.55,1.23,0.55c0.66,0,1.21-0.29,1.65-0.89l0.03,1.18c-0.52,0.34-1.05,0.53-1.6,0.53\r\n  c-0.76,0-1.39-0.26-1.92-0.76c-0.5-0.5-0.76-1.13-0.76-1.89c0-0.74,0.26-1.37,0.79-1.89C4.45,8.84,5.08,8.6,5.81,8.6\r\n  c0.58,0,1.1,0.16,1.55,0.5V10.26z");
    			add_location(path0, file$3, 49, 8, 976);
    			attr_dev(path1, "class", "st0");
    			attr_dev(path1, "d", "M10.8,9.39c0.5,0.03,0.89,0.18,1.21,0.53c0.29,0.34,0.45,0.79,0.45,1.29c0,0.53-0.13,0.97-0.42,1.34\r\n  c-0.31,0.37-0.71,0.55-1.23,0.55v0.81c0.66-0.03,1.18-0.31,1.6-0.81v0.68h0.89V8.74H12.4v0.68c-0.45-0.5-0.97-0.79-1.6-0.81V9.39z\r\n  M9.59,9.94c0.32-0.37,0.71-0.55,1.18-0.55c0.03,0,0.03,0,0.03,0V8.6c-0.03,0-0.08,0-0.1,0c-0.73,0-1.34,0.26-1.78,0.79\r\n  c-0.42,0.5-0.63,1.13-0.63,1.86c0,0.73,0.21,1.34,0.63,1.84c0.47,0.55,1.05,0.81,1.76,0.81c0.05,0,0.1,0,0.13,0v-0.81l0,0\r\n  c-0.52,0-0.92-0.18-1.23-0.58c-0.26-0.34-0.39-0.79-0.39-1.31C9.17,10.7,9.31,10.28,9.59,9.94z");
    			add_location(path1, file$3, 56, 8, 1418);
    			attr_dev(rect0, "x", "14.76");
    			attr_dev(rect0, "y", "4.96");
    			attr_dev(rect0, "class", "st0");
    			attr_dev(rect0, "width", "0.87");
    			attr_dev(rect0, "height", "8.82");
    			add_location(rect0, file$3, 64, 8, 2043);
    			attr_dev(rect1, "x", "17.15");
    			attr_dev(rect1, "y", "4.96");
    			attr_dev(rect1, "class", "st0");
    			attr_dev(rect1, "width", "0.87");
    			attr_dev(rect1, "height", "8.82");
    			add_location(rect1, file$3, 65, 8, 2119);
    			attr_dev(path2, "class", "st0");
    			attr_dev(path2, "d", "M21.98,9.39c0.5,0.03,0.89,0.18,1.21,0.53c0.29,0.34,0.45,0.79,0.45,1.29c0,0.53-0.16,0.97-0.42,1.34\r\n  c-0.32,0.37-0.71,0.55-1.23,0.55v0.81c0.05,0,0.08,0,0.13,0c0.71,0,1.29-0.26,1.76-0.81c0.45-0.5,0.66-1.13,0.66-1.84\r\n  c0-0.74-0.21-1.34-0.66-1.86c-0.45-0.53-1.05-0.79-1.76-0.79c-0.05,0-0.08,0-0.13,0V9.39z M20.77,9.94\r\n  c0.31-0.37,0.71-0.55,1.18-0.55h0.03V8.6c-0.6,0.03-1.15,0.29-1.6,0.81V4.96h-0.87v8.82h0.87l0.03-0.68\r\n  c0.37,0.5,0.89,0.79,1.57,0.81v-0.81l0,0c-0.53,0-0.92-0.18-1.23-0.58c-0.26-0.37-0.39-0.79-0.39-1.31\r\n  C20.35,10.7,20.48,10.28,20.77,9.94z");
    			add_location(path2, file$3, 66, 8, 2195);
    			attr_dev(path3, "class", "st0");
    			attr_dev(path3, "d", "M28.12,9.39c0.52,0,0.94,0.18,1.29,0.55c0.31,0.37,0.5,0.79,0.5,1.31c0,0.5-0.18,0.94-0.5,1.29\r\n  c-0.34,0.37-0.76,0.55-1.29,0.55v0.81c0.73,0,1.36-0.26,1.86-0.79c0.52-0.52,0.79-1.13,0.79-1.86c0-0.74-0.26-1.37-0.76-1.86\r\n  c-0.52-0.53-1.15-0.79-1.89-0.79V9.39z M26.86,9.94c0.34-0.37,0.76-0.55,1.26-0.55V8.6c-0.71,0-1.34,0.26-1.86,0.76\r\n  c-0.5,0.52-0.76,1.15-0.76,1.89c0,0.73,0.26,1.36,0.76,1.86c0.52,0.53,1.15,0.79,1.86,0.79v-0.81c-0.5,0-0.92-0.18-1.26-0.52\r\n  c-0.34-0.37-0.5-0.79-0.5-1.31C26.36,10.73,26.52,10.28,26.86,9.94z");
    			add_location(path3, file$3, 75, 8, 2821);
    			attr_dev(polygon, "class", "st0");
    			attr_dev(polygon, "points", "31.17,8.74 32.22,8.74 33.53,10.44 34.84,8.74 35.92,8.74 34.08,11.1 36.18,13.77 35.1,13.77 \r\n  33.53,11.73 31.95,13.77 30.85,13.77 32.98,11.1 \t\t");
    			add_location(polygon, file$3, 83, 8, 3410);
    			attr_dev(path4, "class", "st1");
    			attr_dev(path4, "d", "M27.68,1.65l-2.97,2.99l0.89,0.87c0,0,1.86-1.89,2.52-2.52c0.63,0.63,2.52,2.52,2.52,2.52l0.87-0.87\r\n  L28.12,1.2L27.68,1.65z");
    			add_location(path4, file$3, 88, 8, 3627);
    			add_location(g0, file$3, 48, 6, 963);
    			attr_dev(path5, "class", "st2");
    			attr_dev(path5, "d", "M3.29,18.77l0.3-1.44h0.19l-0.27,1.28h0.75l-0.03,0.16H3.29z");
    			add_location(path5, file$3, 95, 8, 3838);
    			attr_dev(path6, "class", "st2");
    			attr_dev(path6, "d", "M4.44,18.77l0.3-1.44h1.04L5.74,17.5H4.9L4.8,17.94h0.82l-0.03,0.16H4.77l-0.1,0.5h0.91l-0.03,0.16H4.44z");
    			add_location(path6, file$3, 99, 8, 3962);
    			attr_dev(path7, "class", "st2");
    			attr_dev(path7, "d", "M5.67,18.77l0.82-1.44h0.23l0.24,1.44H6.76l-0.07-0.41H6.11l-0.23,0.41H5.67z M6.19,18.21h0.48l-0.06-0.36\r\n  c-0.02-0.14-0.03-0.26-0.04-0.36c-0.03,0.08-0.08,0.18-0.14,0.29L6.19,18.21z");
    			add_location(path7, file$3, 103, 8, 4129);
    			attr_dev(path8, "class", "st2");
    			attr_dev(path8, "d", "M7.16,18.77l0.3-1.44h0.43c0.1,0,0.18,0.01,0.24,0.02c0.08,0.02,0.15,0.06,0.2,0.11\r\n  c0.06,0.05,0.1,0.12,0.13,0.19c0.03,0.08,0.04,0.17,0.04,0.26c0,0.12-0.02,0.22-0.05,0.32c-0.03,0.1-0.08,0.18-0.14,0.25\r\n  c-0.06,0.07-0.12,0.13-0.18,0.17C8.07,18.7,8,18.73,7.91,18.75c-0.06,0.02-0.14,0.02-0.24,0.02H7.16z M7.38,18.61h0.23\r\n  c0.1,0,0.19-0.01,0.27-0.03c0.05-0.01,0.09-0.03,0.13-0.05c0.05-0.03,0.09-0.07,0.13-0.12c0.05-0.06,0.09-0.14,0.12-0.22\r\n  c0.03-0.08,0.04-0.18,0.04-0.28c0-0.12-0.02-0.21-0.06-0.27c-0.04-0.06-0.09-0.1-0.16-0.12C8.04,17.5,7.97,17.5,7.87,17.5H7.62\r\n  L7.38,18.61z");
    			add_location(path8, file$3, 108, 8, 4375);
    			attr_dev(path9, "class", "st2");
    			attr_dev(path9, "d", "M9.21,18.77l0.3-1.44h0.24l0.15,0.93c0.02,0.12,0.03,0.24,0.04,0.35c0.04-0.1,0.11-0.23,0.2-0.39l0.5-0.89\r\n  h0.24l-0.3,1.44h-0.19l0.15-0.7c0.03-0.16,0.08-0.34,0.15-0.54c-0.04,0.09-0.09,0.19-0.15,0.3l-0.54,0.94H9.81l-0.14-0.92\r\n  c-0.01-0.08-0.02-0.18-0.03-0.3c-0.02,0.13-0.03,0.23-0.05,0.3l-0.19,0.92H9.21z");
    			add_location(path9, file$3, 117, 8, 5021);
    			attr_dev(path10, "class", "st2");
    			attr_dev(path10, "d", "M10.77,18.77l0.82-1.44h0.23l0.24,1.44h-0.19l-0.07-0.41h-0.58l-0.23,0.41H10.77z M11.3,18.21h0.48\r\n  l-0.06-0.36c-0.02-0.14-0.03-0.26-0.04-0.36c-0.03,0.08-0.08,0.18-0.14,0.29L11.3,18.21z");
    			add_location(path10, file$3, 123, 8, 5391);
    			attr_dev(path11, "class", "st2");
    			attr_dev(path11, "d", "M12.27,18.77l0.3-1.44h0.19L13,17.87c0.07,0.16,0.13,0.3,0.18,0.42c0.02,0.07,0.05,0.15,0.09,0.26\r\n  c0.02-0.12,0.04-0.25,0.07-0.37l0.18-0.85h0.19l-0.3,1.44H13.2l-0.36-0.83c-0.06-0.15-0.11-0.28-0.15-0.39\r\n  c-0.01,0.09-0.03,0.21-0.06,0.34l-0.18,0.87H12.27z");
    			add_location(path11, file$3, 128, 8, 5641);
    			attr_dev(path12, "class", "st2");
    			attr_dev(path12, "d", "M13.6,18.77l0.82-1.44h0.23l0.24,1.44H14.7l-0.07-0.41h-0.58l-0.23,0.41H13.6z M14.13,18.21h0.48l-0.06-0.36\r\n  c-0.02-0.14-0.03-0.26-0.04-0.36c-0.03,0.08-0.08,0.18-0.14,0.29L14.13,18.21z");
    			add_location(path12, file$3, 134, 8, 5960);
    			attr_dev(path13, "class", "st2");
    			attr_dev(path13, "d", "M15.83,18.2l0.03-0.16h0.63l-0.12,0.59c-0.08,0.05-0.17,0.09-0.27,0.12c-0.1,0.03-0.2,0.05-0.3,0.05\r\n  c-0.21,0-0.37-0.06-0.47-0.19c-0.09-0.11-0.13-0.24-0.13-0.41c0-0.17,0.04-0.33,0.11-0.47c0.08-0.14,0.17-0.25,0.29-0.31\r\n  c0.12-0.07,0.25-0.1,0.39-0.1c0.1,0,0.19,0.02,0.27,0.06c0.08,0.04,0.14,0.09,0.19,0.15c0.04,0.06,0.07,0.14,0.09,0.24l-0.19,0.02\r\n  c-0.02-0.1-0.06-0.17-0.13-0.23c-0.06-0.05-0.15-0.08-0.25-0.08c-0.1,0-0.2,0.03-0.29,0.08c-0.09,0.06-0.16,0.14-0.22,0.26\r\n  c-0.05,0.11-0.08,0.24-0.08,0.39c0,0.14,0.04,0.25,0.11,0.33c0.07,0.07,0.17,0.11,0.3,0.11c0.12,0,0.26-0.04,0.4-0.12l0.06-0.31\r\n  H15.83z");
    			add_location(path13, file$3, 139, 8, 6209);
    			attr_dev(path14, "class", "st2");
    			attr_dev(path14, "d", "M16.68,18.77l0.3-1.44h1.04l-0.03,0.16h-0.85l-0.09,0.45h0.82l-0.03,0.16h-0.82l-0.1,0.5h0.91l-0.03,0.16\r\n  H16.68z");
    			add_location(path14, file$3, 148, 8, 6880);
    			attr_dev(path15, "class", "st2");
    			attr_dev(path15, "d", "M18.04,18.77l0.3-1.44h0.24l0.15,0.93c0.02,0.12,0.03,0.24,0.04,0.35c0.04-0.1,0.11-0.23,0.2-0.39l0.5-0.89\r\n  h0.24l-0.3,1.44h-0.19l0.15-0.7c0.03-0.16,0.08-0.34,0.15-0.54c-0.04,0.09-0.09,0.19-0.15,0.3l-0.54,0.94h-0.19l-0.14-0.92\r\n  c-0.01-0.08-0.02-0.18-0.03-0.3c-0.02,0.13-0.03,0.23-0.05,0.3l-0.19,0.92H18.04z");
    			add_location(path15, file$3, 153, 8, 7058);
    			attr_dev(path16, "class", "st2");
    			attr_dev(path16, "d", "M19.73,18.77l0.3-1.44h1.04l-0.03,0.16h-0.85l-0.09,0.45h0.82l-0.03,0.16h-0.82l-0.1,0.5h0.91l-0.03,0.16\r\n  H19.73z");
    			add_location(path16, file$3, 159, 8, 7431);
    			attr_dev(path17, "class", "st2");
    			attr_dev(path17, "d", "M21.1,18.77l0.3-1.44h0.19l0.24,0.54c0.07,0.16,0.13,0.3,0.18,0.42c0.02,0.07,0.05,0.15,0.09,0.26\r\n  c0.02-0.12,0.04-0.25,0.07-0.37l0.18-0.85h0.19l-0.3,1.44h-0.19l-0.36-0.83c-0.06-0.15-0.11-0.28-0.15-0.39\r\n  c-0.01,0.09-0.03,0.21-0.06,0.34l-0.18,0.87H21.1z");
    			add_location(path17, file$3, 164, 8, 7609);
    			attr_dev(path18, "class", "st2");
    			attr_dev(path18, "d", "M22.93,18.77l0.27-1.27h-0.47l0.03-0.16h1.13l-0.03,0.16h-0.47l-0.27,1.27H22.93z");
    			add_location(path18, file$3, 170, 8, 7928);
    			attr_dev(path19, "class", "st2");
    			attr_dev(path19, "d", "M24.44,18.31l0.19-0.02l0,0.05c0,0.06,0.01,0.11,0.04,0.15c0.03,0.05,0.07,0.08,0.13,0.11\r\n  c0.06,0.03,0.13,0.04,0.21,0.04c0.12,0,0.2-0.03,0.26-0.08c0.06-0.05,0.09-0.11,0.09-0.17c0-0.05-0.02-0.09-0.05-0.12\r\n  c-0.03-0.04-0.12-0.09-0.27-0.15c-0.11-0.05-0.19-0.09-0.23-0.11c-0.06-0.04-0.11-0.09-0.14-0.14c-0.03-0.05-0.05-0.11-0.05-0.17\r\n  c0-0.07,0.02-0.14,0.06-0.2c0.04-0.06,0.1-0.1,0.18-0.14c0.08-0.03,0.17-0.05,0.26-0.05c0.12,0,0.22,0.02,0.3,0.06\r\n  c0.08,0.04,0.14,0.09,0.18,0.16c0.04,0.07,0.05,0.13,0.05,0.19c0,0.01,0,0.02,0,0.03l-0.19,0.01c0-0.04,0-0.07-0.01-0.1\r\n  c-0.01-0.04-0.03-0.07-0.06-0.1c-0.03-0.03-0.07-0.05-0.11-0.07c-0.05-0.02-0.1-0.03-0.16-0.03c-0.1,0-0.19,0.02-0.24,0.07\r\n  c-0.04,0.04-0.07,0.08-0.07,0.14c0,0.04,0.01,0.07,0.03,0.09c0.02,0.03,0.05,0.06,0.1,0.08c0.03,0.02,0.11,0.06,0.24,0.11\r\n  c0.1,0.05,0.17,0.08,0.21,0.11c0.05,0.03,0.09,0.08,0.12,0.13c0.03,0.05,0.04,0.11,0.04,0.17c0,0.08-0.02,0.15-0.07,0.22\r\n  c-0.05,0.07-0.11,0.12-0.2,0.15c-0.08,0.04-0.18,0.05-0.29,0.05c-0.16,0-0.3-0.04-0.4-0.11C24.49,18.62,24.44,18.49,24.44,18.31z");
    			add_location(path19, file$3, 174, 8, 8072);
    			attr_dev(path20, "class", "st2");
    			attr_dev(path20, "d", "M25.84,18.17c0-0.26,0.07-0.46,0.22-0.62c0.15-0.16,0.33-0.24,0.54-0.24c0.18,0,0.33,0.06,0.44,0.18\r\n  c0.11,0.12,0.17,0.27,0.17,0.47c0,0.14-0.03,0.27-0.09,0.39c-0.04,0.09-0.1,0.17-0.16,0.23c-0.06,0.07-0.13,0.12-0.21,0.15\r\n  c-0.1,0.05-0.2,0.07-0.31,0.07c-0.12,0-0.22-0.03-0.31-0.08c-0.09-0.05-0.17-0.13-0.21-0.23C25.87,18.38,25.84,18.28,25.84,18.17z\r\n  M26.03,18.18c0,0.08,0.02,0.16,0.05,0.23c0.03,0.07,0.09,0.13,0.16,0.17c0.07,0.04,0.14,0.06,0.22,0.06\r\n  c0.07,0,0.14-0.02,0.21-0.05c0.07-0.03,0.13-0.08,0.18-0.15c0.05-0.06,0.09-0.14,0.12-0.23c0.03-0.09,0.05-0.18,0.05-0.27\r\n  c0-0.14-0.04-0.26-0.12-0.34c-0.08-0.09-0.18-0.13-0.3-0.13c-0.15,0-0.28,0.06-0.4,0.19C26.09,17.79,26.03,17.96,26.03,18.18z");
    			add_location(path20, file$3, 186, 8, 9193);
    			attr_dev(path21, "class", "st2");
    			attr_dev(path21, "d", "M27.32,18.77l0.3-1.44h0.19l-0.27,1.28h0.75l-0.03,0.16H27.32z");
    			add_location(path21, file$3, 195, 8, 9955);
    			attr_dev(path22, "class", "st2");
    			attr_dev(path22, "d", "M28.78,17.33h0.19l-0.18,0.88c-0.02,0.07-0.02,0.13-0.02,0.16c0,0.08,0.03,0.14,0.09,0.19\r\n  c0.06,0.05,0.14,0.07,0.23,0.07c0.07,0,0.14-0.02,0.2-0.05c0.06-0.03,0.11-0.08,0.15-0.15c0.04-0.07,0.07-0.17,0.1-0.31l0.17-0.79\r\n  h0.19l-0.18,0.84c-0.03,0.14-0.07,0.26-0.12,0.34c-0.05,0.08-0.12,0.15-0.2,0.2c-0.09,0.05-0.19,0.08-0.3,0.08\r\n  c-0.11,0-0.2-0.02-0.28-0.05c-0.08-0.04-0.14-0.09-0.18-0.15c-0.04-0.06-0.06-0.14-0.06-0.22c0-0.05,0.01-0.14,0.04-0.26\r\n  L28.78,17.33z");
    			add_location(path22, file$3, 199, 8, 10081);
    			attr_dev(path23, "class", "st2");
    			attr_dev(path23, "d", "M30.31,18.77l0.27-1.27H30.1l0.03-0.16h1.13l-0.03,0.16h-0.47l-0.27,1.27H30.31z");
    			add_location(path23, file$3, 207, 8, 10609);
    			attr_dev(path24, "class", "st2");
    			attr_dev(path24, "d", "M31.21,18.77l0.3-1.44h0.19l-0.3,1.44H31.21z");
    			add_location(path24, file$3, 211, 8, 10752);
    			attr_dev(path25, "class", "st2");
    			attr_dev(path25, "d", "M31.86,18.17c0-0.26,0.07-0.46,0.22-0.62c0.15-0.16,0.33-0.24,0.54-0.24c0.18,0,0.33,0.06,0.44,0.18\r\n  c0.11,0.12,0.17,0.27,0.17,0.47c0,0.14-0.03,0.27-0.09,0.39c-0.04,0.09-0.1,0.17-0.16,0.23c-0.06,0.07-0.13,0.12-0.21,0.15\r\n  c-0.1,0.05-0.2,0.07-0.31,0.07c-0.12,0-0.22-0.03-0.31-0.08c-0.09-0.05-0.17-0.13-0.21-0.23C31.88,18.38,31.86,18.28,31.86,18.17z\r\n  M32.05,18.18c0,0.08,0.02,0.16,0.05,0.23s0.09,0.13,0.16,0.17c0.07,0.04,0.14,0.06,0.22,0.06c0.07,0,0.14-0.02,0.21-0.05\r\n  c0.07-0.03,0.13-0.08,0.18-0.15c0.05-0.06,0.09-0.14,0.12-0.23c0.03-0.09,0.05-0.18,0.05-0.27c0-0.14-0.04-0.26-0.12-0.34\r\n  c-0.08-0.09-0.18-0.13-0.3-0.13c-0.15,0-0.28,0.06-0.4,0.19C32.11,17.79,32.05,17.96,32.05,18.18z");
    			add_location(path25, file$3, 212, 8, 10830);
    			attr_dev(path26, "class", "st2");
    			attr_dev(path26, "d", "M33.36,18.77l0.3-1.44h0.19l0.24,0.54c0.07,0.16,0.13,0.3,0.18,0.42c0.02,0.07,0.05,0.15,0.09,0.26\r\n  c0.02-0.12,0.04-0.25,0.07-0.37l0.18-0.85h0.19l-0.3,1.44h-0.19l-0.36-0.83c-0.06-0.15-0.11-0.28-0.15-0.39\r\n  c-0.01,0.09-0.03,0.21-0.06,0.34l-0.18,0.87H33.36z");
    			add_location(path26, file$3, 221, 8, 11582);
    			attr_dev(path27, "class", "st2");
    			attr_dev(path27, "d", "M34.87,18.31l0.19-0.02l0,0.05c0,0.06,0.01,0.11,0.04,0.15c0.03,0.05,0.07,0.08,0.13,0.11\r\n  c0.06,0.03,0.13,0.04,0.21,0.04c0.12,0,0.2-0.03,0.26-0.08c0.06-0.05,0.09-0.11,0.09-0.17c0-0.05-0.02-0.09-0.05-0.12\r\n  c-0.03-0.04-0.12-0.09-0.27-0.15c-0.11-0.05-0.19-0.09-0.23-0.11c-0.06-0.04-0.11-0.09-0.14-0.14c-0.03-0.05-0.05-0.11-0.05-0.17\r\n  c0-0.07,0.02-0.14,0.06-0.2c0.04-0.06,0.1-0.1,0.18-0.14c0.08-0.03,0.17-0.05,0.26-0.05c0.12,0,0.22,0.02,0.3,0.06\r\n  s0.14,0.09,0.18,0.16c0.04,0.07,0.05,0.13,0.05,0.19c0,0.01,0,0.02,0,0.03l-0.19,0.01c0-0.04,0-0.07-0.01-0.1\r\n  c-0.01-0.04-0.03-0.07-0.06-0.1c-0.03-0.03-0.07-0.05-0.11-0.07c-0.05-0.02-0.1-0.03-0.16-0.03c-0.1,0-0.19,0.02-0.24,0.07\r\n  c-0.04,0.04-0.07,0.08-0.07,0.14c0,0.04,0.01,0.07,0.03,0.09c0.02,0.03,0.05,0.06,0.1,0.08c0.03,0.02,0.11,0.06,0.24,0.11\r\n  c0.1,0.05,0.17,0.08,0.21,0.11c0.05,0.03,0.09,0.08,0.12,0.13c0.03,0.05,0.04,0.11,0.04,0.17c0,0.08-0.02,0.15-0.07,0.22\r\n  c-0.05,0.07-0.11,0.12-0.2,0.15c-0.08,0.04-0.18,0.05-0.29,0.05c-0.16,0-0.3-0.04-0.4-0.11C34.92,18.62,34.87,18.49,34.87,18.31z");
    			add_location(path27, file$3, 227, 8, 11903);
    			add_location(g1, file$3, 94, 6, 3825);
    			add_location(g2, file$3, 47, 4, 952);
    			attr_dev(svg, "version", "1.1");
    			attr_dev(svg, "id", "Layer_1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "height", "80");
    			attr_dev(svg, "width", "150");
    			attr_dev(svg, "viewBox", "0 0 40 20");
    			set_style(svg, "enable-background", "new 0 0 40 20");
    			attr_dev(svg, "xml:space", "preserve");
    			add_location(svg, file$3, 21, 2, 381);
    			attr_dev(button, "class", "homebutton svelte-357yf7");
    			add_location(button, file$3, 20, 0, 323);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, style);
    			append_dev(style, t);
    			append_dev(svg, g2);
    			append_dev(g2, g0);
    			append_dev(g0, path0);
    			append_dev(g0, path1);
    			append_dev(g0, rect0);
    			append_dev(g0, rect1);
    			append_dev(g0, path2);
    			append_dev(g0, path3);
    			append_dev(g0, polygon);
    			append_dev(g0, path4);
    			append_dev(g2, g1);
    			append_dev(g1, path5);
    			append_dev(g1, path6);
    			append_dev(g1, path7);
    			append_dev(g1, path8);
    			append_dev(g1, path9);
    			append_dev(g1, path10);
    			append_dev(g1, path11);
    			append_dev(g1, path12);
    			append_dev(g1, path13);
    			append_dev(g1, path14);
    			append_dev(g1, path15);
    			append_dev(g1, path16);
    			append_dev(g1, path17);
    			append_dev(g1, path18);
    			append_dev(g1, path19);
    			append_dev(g1, path20);
    			append_dev(g1, path21);
    			append_dev(g1, path22);
    			append_dev(g1, path23);
    			append_dev(g1, path24);
    			append_dev(g1, path25);
    			append_dev(g1, path26);
    			append_dev(g1, path27);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $viewfield;
    	let $MoreField;
    	let $fields;
    	let $seeMore;
    	let $SearchTerm;
    	let $isSearching;
    	validate_store(viewfield, 'viewfield');
    	component_subscribe($$self, viewfield, $$value => $$invalidate(2, $viewfield = $$value));
    	validate_store(MoreField, 'MoreField');
    	component_subscribe($$self, MoreField, $$value => $$invalidate(3, $MoreField = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(4, $fields = $$value));
    	validate_store(seeMore, 'seeMore');
    	component_subscribe($$self, seeMore, $$value => $$invalidate(5, $seeMore = $$value));
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(6, $SearchTerm = $$value));
    	validate_store(isSearching, 'isSearching');
    	component_subscribe($$self, isSearching, $$value => $$invalidate(7, $isSearching = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dashboard', slots, []);

    	function onClick() {
    		set_store_value(isSearching, $isSearching = false, $isSearching);
    		set_store_value(SearchTerm, $SearchTerm = '', $SearchTerm);
    		set_store_value(seeMore, $seeMore = false, $seeMore);
    		set_store_value(fields, $fields = '', $fields);
    		set_store_value(MoreField, $MoreField = false, $MoreField);
    		set_store_value(viewfield, $viewfield = false, $viewfield);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dashboard> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => onClick();

    	$$self.$capture_state = () => ({
    		isSearching,
    		SearchTerm,
    		seeMore,
    		fields,
    		MoreField,
    		viewfield,
    		onClick,
    		$viewfield,
    		$MoreField,
    		$fields,
    		$seeMore,
    		$SearchTerm,
    		$isSearching
    	});

    	return [onClick, click_handler];
    }

    class Dashboard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dashboard",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\ContentSelector.svelte generated by Svelte v3.47.0 */
    const file$2 = "src\\components\\ContentSelector.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i].id;
    	child_ctx[4] = list[i].label;
    	return child_ctx;
    }

    // (15:4) {#each selec as { id, label }
    function create_each_block(key_1, ctx) {
    	let option;
    	let t0_value = /*label*/ ctx[4] + "";
    	let t0;
    	let t1;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*id*/ ctx[3];
    			option.value = option.__value;
    			add_location(option, file$2, 15, 6, 468);
    			this.first = option;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(15:4) {#each selec as { id, label }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let select;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let mounted;
    	let dispose;
    	let each_value = /*selec*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[3];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "wrapper-spacer");
    			add_location(div0, file$2, 11, 0, 313);
    			attr_dev(select, "class", "rc-select svelte-1qp8wwp");
    			if (/*$category*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[2].call(select));
    			add_location(select, file$2, 13, 2, 370);
    			attr_dev(div1, "class", "wrapper svelte-1qp8wwp");
    			add_location(div1, file$2, 12, 0, 345);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, select);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*$category*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*selec*/ 2) {
    				each_value = /*selec*/ ctx[1];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, select, destroy_block, create_each_block, null, get_each_context);
    			}

    			if (dirty & /*$category, selec*/ 3) {
    				select_option(select, /*$category*/ ctx[0]);
    			}
    		},
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $category;
    	validate_store(category, 'category');
    	component_subscribe($$self, category, $$value => $$invalidate(0, $category = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentSelector', slots, []);
    	const selec = [{ id: 1, label: 'Case Studies' }, { id: 2, label: 'Coming Soon...' }];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ContentSelector> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		$category = select_value(this);
    		category.set($category);
    		$$invalidate(1, selec);
    	}

    	$$self.$capture_state = () => ({
    		Query: Query$1,
    		Skeleton,
    		SearchTerm,
    		selection,
    		fields,
    		category,
    		selec,
    		$category
    	});

    	return [$category, selec, select_change_handler];
    }

    class ContentSelector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentSelector",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\UserAccount.svelte generated by Svelte v3.47.0 */

    const file$1 = "src\\components\\UserAccount.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let svg;
    	let path;
    	let t0;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			div0 = element("div");
    			div0.textContent = "Coming Soon...";
    			attr_dev(path, "d", "M11.1 35.25Q14.25 33.05 17.35 31.875Q20.45 30.7 24 30.7Q27.55 30.7 30.675 31.875Q33.8 33.05 36.95 35.25Q39.15 32.55 40.075 29.8Q41 27.05 41 24Q41 16.75 36.125 11.875Q31.25 7 24 7Q16.75 7 11.875 11.875Q7 16.75 7 24Q7 27.05 7.95 29.8Q8.9 32.55 11.1 35.25ZM24 25.5Q21.1 25.5 19.125 23.525Q17.15 21.55 17.15 18.65Q17.15 15.75 19.125 13.775Q21.1 11.8 24 11.8Q26.9 11.8 28.875 13.775Q30.85 15.75 30.85 18.65Q30.85 21.55 28.875 23.525Q26.9 25.5 24 25.5ZM24 44Q19.9 44 16.25 42.425Q12.6 40.85 9.875 38.125Q7.15 35.4 5.575 31.75Q4 28.1 4 24Q4 19.85 5.575 16.225Q7.15 12.6 9.875 9.875Q12.6 7.15 16.25 5.575Q19.9 4 24 4Q28.15 4 31.775 5.575Q35.4 7.15 38.125 9.875Q40.85 12.6 42.425 16.225Q44 19.85 44 24Q44 28.1 42.425 31.75Q40.85 35.4 38.125 38.125Q35.4 40.85 31.775 42.425Q28.15 44 24 44ZM24 41Q26.75 41 29.375 40.2Q32 39.4 34.55 37.4Q32 35.6 29.35 34.65Q26.7 33.7 24 33.7Q21.3 33.7 18.65 34.65Q16 35.6 13.45 37.4Q16 39.4 18.625 40.2Q21.25 41 24 41ZM24 22.5Q25.7 22.5 26.775 21.425Q27.85 20.35 27.85 18.65Q27.85 16.95 26.775 15.875Q25.7 14.8 24 14.8Q22.3 14.8 21.225 15.875Q20.15 16.95 20.15 18.65Q20.15 20.35 21.225 21.425Q22.3 22.5 24 22.5ZM24 18.65Q24 18.65 24 18.65Q24 18.65 24 18.65Q24 18.65 24 18.65Q24 18.65 24 18.65Q24 18.65 24 18.65Q24 18.65 24 18.65Q24 18.65 24 18.65Q24 18.65 24 18.65ZM24 37.35Q24 37.35 24 37.35Q24 37.35 24 37.35Q24 37.35 24 37.35Q24 37.35 24 37.35Q24 37.35 24 37.35Q24 37.35 24 37.35Q24 37.35 24 37.35Q24 37.35 24 37.35Z");
    			add_location(path, file$1, 5, 5, 132);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#f7f7f7");
    			attr_dev(svg, "height", "48");
    			attr_dev(svg, "width", "48");
    			add_location(svg, file$1, 4, 2, 48);
    			attr_dev(div0, "class", "account-hover svelte-156b8an");
    			add_location(div0, file$1, 9, 2, 1612);
    			attr_dev(div1, "class", "account svelte-156b8an");
    			add_location(div1, file$1, 3, 0, 23);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, svg);
    			append_dev(svg, path);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    		},
    		p: noop$1,
    		i: noop$1,
    		o: noop$1,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UserAccount', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UserAccount> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class UserAccount extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UserAccount",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\components\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\components\\App.svelte";

    // (315:4) {#if $category == 1}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$isSearching*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(315:4) {#if $category == 1}",
    		ctx
    	});

    	return block;
    }

    // (324:6) {:else}
    function create_else_block_1(ctx) {
    	let searchform;
    	let t;
    	let result;
    	let current;
    	searchform = new SearchForm({ $$inline: true });
    	result = new Result({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(searchform.$$.fragment);
    			t = space();
    			create_component(result.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchform, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(result, target, anchor);
    			current = true;
    		},
    		p: noop$1,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchform.$$.fragment, local);
    			transition_in(result.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchform.$$.fragment, local);
    			transition_out(result.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchform, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(result, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(324:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (316:6) {#if $isSearching}
    function create_if_block_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$fields*/ ctx[0].length) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(316:6) {#if $isSearching}",
    		ctx
    	});

    	return block;
    }

    // (320:8) {:else}
    function create_else_block(ctx) {
    	let searchform;
    	let t;
    	let searchresult;
    	let current;
    	searchform = new SearchForm({ $$inline: true });
    	searchresult = new SearchResult({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(searchform.$$.fragment);
    			t = space();
    			create_component(searchresult.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchform, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(searchresult, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchform.$$.fragment, local);
    			transition_in(searchresult.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchform.$$.fragment, local);
    			transition_out(searchresult.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchform, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(searchresult, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(320:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (317:8) {#if $fields.length}
    function create_if_block_2(ctx) {
    	let searchform;
    	let t;
    	let fieldresult;
    	let current;
    	searchform = new SearchForm({ $$inline: true });
    	fieldresult = new FieldResult({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(searchform.$$.fragment);
    			t = space();
    			create_component(fieldresult.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(searchform, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(fieldresult, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(searchform.$$.fragment, local);
    			transition_in(fieldresult.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(searchform.$$.fragment, local);
    			transition_out(fieldresult.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(searchform, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(fieldresult, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(317:8) {#if $fields.length}",
    		ctx
    	});

    	return block;
    }

    // (37:0) <QueryClientProvider client={queryClient}>
    function create_default_slot(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let dashboard;
    	let t0;
    	let contentselector;
    	let t1;
    	let div0;
    	let t3;
    	let useraccount;
    	let t4;
    	let current;
    	dashboard = new Dashboard({ $$inline: true });
    	contentselector = new ContentSelector({ $$inline: true });
    	useraccount = new UserAccount({ $$inline: true });
    	let if_block = /*$category*/ ctx[2] == 1 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			create_component(dashboard.$$.fragment);
    			t0 = space();
    			create_component(contentselector.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			div0.textContent = "|";
    			t3 = space();
    			create_component(useraccount.$$.fragment);
    			t4 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "divider svelte-fxkm5k");
    			add_location(div0, file, 310, 8, 15922);
    			attr_dev(div1, "class", "nav-wrapper svelte-fxkm5k");
    			add_location(div1, file, 307, 6, 15838);
    			attr_dev(div2, "class", "navbar-selection svelte-fxkm5k");
    			add_location(div2, file, 306, 4, 15801);
    			attr_dev(div3, "class", "svelte-fxkm5k");
    			add_location(div3, file, 37, 2, 1072);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(dashboard, div1, null);
    			append_dev(div1, t0);
    			mount_component(contentselector, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div1, t3);
    			mount_component(useraccount, div1, null);
    			append_dev(div3, t4);
    			if (if_block) if_block.m(div3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$category*/ ctx[2] == 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$category*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dashboard.$$.fragment, local);
    			transition_in(contentselector.$$.fragment, local);
    			transition_in(useraccount.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dashboard.$$.fragment, local);
    			transition_out(contentselector.$$.fragment, local);
    			transition_out(useraccount.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(dashboard);
    			destroy_component(contentselector);
    			destroy_component(useraccount);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(37:0) <QueryClientProvider client={queryClient}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let queryclientprovider;
    	let current;

    	queryclientprovider = new QueryClientProvider$1({
    			props: {
    				client: /*queryClient*/ ctx[3],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(queryclientprovider.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(queryclientprovider, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const queryclientprovider_changes = {};

    			if (dirty & /*$$scope, $fields, $isSearching, $category*/ 519) {
    				queryclientprovider_changes.$$scope = { dirty, ctx };
    			}

    			queryclientprovider.$set(queryclientprovider_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(queryclientprovider.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(queryclientprovider.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(queryclientprovider, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $viewfield;
    	let $MoreField;
    	let $fields;
    	let $seeMore;
    	let $SearchTerm;
    	let $isSearching;
    	let $category;
    	validate_store(viewfield, 'viewfield');
    	component_subscribe($$self, viewfield, $$value => $$invalidate(4, $viewfield = $$value));
    	validate_store(MoreField, 'MoreField');
    	component_subscribe($$self, MoreField, $$value => $$invalidate(5, $MoreField = $$value));
    	validate_store(fields, 'fields');
    	component_subscribe($$self, fields, $$value => $$invalidate(0, $fields = $$value));
    	validate_store(seeMore, 'seeMore');
    	component_subscribe($$self, seeMore, $$value => $$invalidate(6, $seeMore = $$value));
    	validate_store(SearchTerm, 'SearchTerm');
    	component_subscribe($$self, SearchTerm, $$value => $$invalidate(7, $SearchTerm = $$value));
    	validate_store(isSearching, 'isSearching');
    	component_subscribe($$self, isSearching, $$value => $$invalidate(1, $isSearching = $$value));
    	validate_store(category, 'category');
    	component_subscribe($$self, category, $$value => $$invalidate(2, $category = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const queryClient = new QueryClient();

    	function onClick() {
    		set_store_value(isSearching, $isSearching = false, $isSearching);
    		set_store_value(SearchTerm, $SearchTerm = '', $SearchTerm);
    		set_store_value(seeMore, $seeMore = false, $seeMore);
    		set_store_value(fields, $fields = '', $fields);
    		set_store_value(MoreField, $MoreField = false, $MoreField);
    		set_store_value(viewfield, $viewfield = false, $viewfield);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		NoResult,
    		Result,
    		QueryClient,
    		QueryClientProvider: QueryClientProvider$1,
    		SearchTerm,
    		isSearching,
    		fields,
    		seeMore,
    		MoreField,
    		viewfield,
    		category,
    		SearchForm,
    		FieldResult,
    		SeeMore,
    		MoreFieldResult,
    		HomeButton: HomeButton_1,
    		TableLoading,
    		SearchResult,
    		Dashboard,
    		ContentSelector,
    		UserAccount,
    		queryClient,
    		onClick,
    		$viewfield,
    		$MoreField,
    		$fields,
    		$seeMore,
    		$SearchTerm,
    		$isSearching,
    		$category
    	});

    	return [$fields, $isSearching, $category, queryClient];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const target = document.querySelector('#svelte-root');

    const app = new App({ target });

    return app;

})();
//# sourceMappingURL=bundle.js.map
