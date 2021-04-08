export function createPopper(reference, popper, options) {
    options.onFirstUpdate = (state) => options.objRef.invokeMethodAsync('CallOnFirstUpdate', stripState(state));

    if (options.modifiers != null) {
        options.modifiers = options.modifiers.map(modifier => {
            var objRef = modifier.objRef;
            if (modifier.hasFn) {
                modifier.fn = (modifierArguments) => {
                    modifierArguments.state = stripState(modifierArguments.state);
                    delete modifierArguments.instance;
                    delete modifierArguments.options;
                    objRef.invokeMethodAsync('CallFn', modifierArguments);
                }
            }
            delete modifier.objRef;
            delete modifier.hasFn;
            return modifier;
        });
    }
    return Popper.createPopper(reference, popper, options);
}

export function getStateOfInstance(instance) {
    return stripState(instance.state)
}

export function updateOnInstance(instance) {
    return instance.update().then(state => stripState(state));
}

export function setOptionsOnInstance(instance, options) {
    options.onFirstUpdate = (state) => {
        options.objRef.invokeMethodAsync('CallOnFirstUpdate', stripState(state))
    };
    return instance.setOptions(options).then(state => stripState(state));
}

function stripState(state) {
    return {
        attributes: state.attributes,
        elements: Object.keys(state.elements),
        modifiersData: state.modifiersData,
        placement: state.placement,
        // We need a custom serilizer/deserilizer before we can parse this back.
        // orderedModifiers: state.orderedModifiers.map(modifier => ({ name: modifier.name, enabled: modifier.enabled, phase: modifier.phase })),
    }
}