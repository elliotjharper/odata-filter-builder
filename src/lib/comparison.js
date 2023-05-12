import inputFieldToString from './inputFieldToString';
import inputRuleToString from './inputRuleToString';
import normalise from './normaliseValue';

function not(rule) {
    const ruleString = inputRuleToString(rule);
    if (ruleString) {
        return `not (${ruleString})`;
    }
}

function compare(field, operator, value, normaliseValue = true) {
    // make sure that field is string
    field = inputFieldToString(field);

    if (normaliseValue) {
        value = normalise(value);
    }

    return `${field} ${operator} ${value}`;
}

function compareMap(field, operator, values, normaliseValues = true) {
    if (!values) {
        return [];
    }

    // make sure that field is string
    field = inputFieldToString(field);

    if (!Array.isArray(values)) {
        return [compare(field, operator, values, normaliseValues)];
    }

    return values.map((value) =>
        compare(field, operator, value, normaliseValues)
    );
}

function eq(field, value, normaliseValue) {
    return compare(field, 'eq', value, normaliseValue);
}

function ne(field, value, normaliseValue) {
    return compare(field, 'ne', value, normaliseValue);
}

function gt(field, value, normaliseValue) {
    return compare(field, 'gt', value, normaliseValue);
}

function ge(field, value, normaliseValue) {
    return compare(field, 'ge', value, normaliseValue);
}

function lt(field, value, normaliseValue) {
    return compare(field, 'lt', value, normaliseValue);
}

function le(field, value, normaliseValue) {
    return compare(field, 'le', value, normaliseValue);
}

function joinRules(rules, condition) {
    return rules.join(` ${condition} `);
}

/**
 * @param {string|InputFieldExpression} field - Field to compare
 * @param {string[]|number[]} values - Values to compare with
 * @returns {ODataFilterBuilder} The {@link ODataFilterBuilder} instance
 */
function compareIn(field, values) {
    const normalisedValues = values.map(normalise);
    const valuesAsArrayString = `(${normalisedValues.join(', ')})`;
    return compare(field, 'in', valuesAsArrayString, false);
}

function compareAll(objectValue, normaliseValues) {
    const keys = Object.keys(objectValue);
    const rules = keys
        .filter((k) => typeof objectValue[k] !== 'undefined')
        .map((field) => {
            const value = objectValue[field];

            if (Array.isArray(value)) {
                return `(${compareIn(field, value, normaliseValues)})`;
            } else {
                return eq(field, value, normaliseValues);
            }
        });

    return joinRules(rules, 'and');
}

function compareNotIn(field, values) {
    return not(compareIn(field, values));
}

export {
    not,
    compare,
    compareMap,
    eq,
    ne,
    gt,
    ge,
    lt,
    le,
    compareIn,
    compareAll,
    compareNotIn,
};
