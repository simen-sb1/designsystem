import { getListToRender } from './getListToRender';

export const stateChangeTypes = {
    InputFocus: 'InputFocus',
    InputClick: 'InputClick',
    InputChange: 'InputChange',
    InputKeyDownEscape: 'InputKeyDownEscape',
    InputKeyDownEnter: 'InputKeyDownEnter',
    InputKeyDownArrowDown: 'InputKeyDownArrowDown',
    InputKeyDownArrowUp: 'InputKeyDownArrowUp',
    ClearButtonPressed: 'ClearButtonPressed',
    ToggleButtonPressed: 'ToggleButtonPressed',
    ItemOnClick: 'ItemOnMouseDown',
    FocusMovedOutSide: 'FocusMovedOutSide',
    ItemSelectedProgrammatically: 'ItemSelectedProgrammatically',
};

export const createReducer = ({
    searchAttributes,
    dropdownList,
    noMatchDropdownList,
    maxRenderedDropdownElements,
    searchMatcher,
    onChange,
}) => (state, action) => {
    switch (action.type) {
        case stateChangeTypes.InputKeyDownEscape:
            return {
                ...state,
                noMatch: false,
                isExpanded: false,
                highlightedIndex: -1,
                inputValue: state.selectedItem
                    ? state.selectedItem[searchAttributes[0]]
                    : '',
            };
        case stateChangeTypes.InputClick: {
            const { noMatch, listToRender } = getListToRender({
                inputValue: state.inputValue,
                searchAttributes,
                maxRenderedDropdownElements,
                dropdownList,
                noMatchDropdownList,
                searchMatcher,
                showAllItemsInDropdown: true,
            });

            return {
                ...state,
                isExpanded: true,
                listToRender,
                prevResultCount: state.listToRender.length,
                noMatch,
            };
        }
        case stateChangeTypes.InputChange: {
            const { noMatch, listToRender } = getListToRender({
                inputValue: action.payload.inputValue,
                searchAttributes,
                maxRenderedDropdownElements,
                dropdownList,
                noMatchDropdownList,
                searchMatcher,
                showAllItemsInDropdown: false,
            });

            return {
                ...state,
                isExpanded: true,
                inputValue: action.payload.inputValue,
                prevResultCount: state.listToRender.length,
                listToRender,
                highlightedIndex:
                    action.payload.inputValue.trim() === '' ||
                    state.listToRender.length === 0
                        ? -1
                        : 0,
                noMatch,
            };
        }
        case stateChangeTypes.ClearButtonPressed: {
            const { noMatch, listToRender } = getListToRender({
                inputValue: '',
                searchAttributes,
                maxRenderedDropdownElements,
                dropdownList,
                prevResultCount: state.listToRender.length,
                noMatchDropdownList,
                searchMatcher,
                showAllItemsInDropdown: true,
            });
            return {
                ...state,
                inputValue: '',
                prevSelectedItem: state.selectedItem,
                selectedItem: null,
                listToRender,
                noMatch,
            };
        }
        case stateChangeTypes.ToggleButtonPressed:
            return {
                ...state,
                isExpanded: !state.isExpanded,
            };
        case stateChangeTypes.ItemSelectedProgrammatically:
        case stateChangeTypes.ItemOnClick:
        case stateChangeTypes.InputKeyDownEnter:
            return {
                ...state,
                isExpanded: false,
                highlightedIndex: -1,
                prevSelectedItem: state.selectedItem,
                selectedItem: action.payload.selectedItem,
                inputValue:
                    action.payload.selectedItem?.[searchAttributes[0]] || '',
            };

        case stateChangeTypes.InputKeyDownArrowDown:
        case stateChangeTypes.InputKeyDownArrowUp: {
            return {
                ...state,
                highlightedIndex: action.payload.highlightedIndex,
            };
        }

        case stateChangeTypes.FocusMovedOutSide: {
            const { listToRender } = getListToRender({
                inputValue: state.inputValue,
                searchAttributes,
                maxRenderedDropdownElements,
                dropdownList,
                noMatchDropdownList,
                searchMatcher,
                showAllItemsInDropdown: false,
            });

            const selectedItem =
                state.inputValue !== ''
                    ? listToRender.length === 1
                        ? listToRender[0]
                        : state.selectedItem
                    : null;

            const inputValue =
                selectedItem && state.inputValue !== ''
                    ? selectedItem[searchAttributes[0]]
                    : '';

            if (selectedItem !== state.selectedItem) {
                onChange(selectedItem);
            }

            return {
                ...state,
                isExpanded: false,
                highlightedIndex: -1,
                inputValue,
                selectedItem,
            };
        }
        default:
            return state;
    }
};
