import React from 'react';
import { array, string, number, func, oneOfType, shape } from 'prop-types';
import ListItem from './ListItem';

const ListContainer = ({
    dropdownAttributes,
    dropdownList,
    highlightedIndex,
    noMatch,
    onSelect,
    renderDropdownElement,
    refHighlightedListItem,
    maxRenderedDropdownElements,
}) => {
    const itemsToRender =
        dropdownList.length > 0
            ? maxRenderedDropdownElements > 0
                ? dropdownList.slice(0, maxRenderedDropdownElements)
                : dropdownList
            : typeof noMatch === 'string'
                ? []
                : noMatch.items;
    return (
        <ul
            className="ffe-searchable-dropdown__scroll-container-list"
            role="listbox"
            aria-activedescendant={
                dropdownList.length > 0 &&
                highlightedIndex > -1 &&
                highlightedIndex
            }
        >
            {dropdownList.length === 0 && (
                <li className="ffe-searchable-dropdown__item">
                    {typeof noMatch === 'string' ? noMatch : noMatch.text}
                </li>
            )}

            {itemsToRender.map((item, index) => {
                return (
                    <ListItem
                        id={index}
                        key={index}
                        isHighlighted={index === highlightedIndex}
                        item={item}
                        onSelect={onSelect}
                        dropdownAttributes={dropdownAttributes}
                        renderElement={renderDropdownElement}
                        refHighlightedListItem={refHighlightedListItem}
                    />
                );
            })}
            {maxRenderedDropdownElements > 0 &&
                dropdownList.length > maxRenderedDropdownElements && (
                    <li className="ffe-searchable-dropdown__item">...</li>
                )}
        </ul>
    );
};

ListContainer.propTypes = {
    dropdownAttributes: array,
    dropdownList: array.isRequired,
    maxRenderedDropdownElements: number,
    highlightedIndex: number.isRequired,
    noMatch: oneOfType([
        string,
        shape({
            text: string.isRequired,
            items: array,
        }),
    ]).isRequired,
    onSelect: func.isRequired,
    renderDropdownElement: func,
    refHighlightedListItem: func.isRequired,
};

export default ListContainer;
