import type { ChangeEvent, FC, ReactElement } from 'react';
import { useContext } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Button } from '@nextui-org/button';
import { useIntl } from 'react-intl';
import type { Facet } from 'visearch-javascript-sdk';
import { Slider } from '@nextui-org/slider';
import { Checkbox } from '@nextui-org/checkbox';
import type { FacetType } from '../../../common/types/constants';
import { WidgetDataContext } from '../../../common/types/contexts';
import LeftChevronIcon from '../../../common/icons/LeftChevronIcon';
import { getFacetNameByKey, getTitleCase } from '../../../common/utils';

interface FilterOptionsProps {
  facets: Facet[];
  selectedFilters: Record<FacetType, any>;
  setSelectedFilters: (selectedFilters: any) => void;
  onApplyHandler: () => void;
}

const FilterOptions:FC<FilterOptionsProps> = ({ facets, selectedFilters, setSelectedFilters, onApplyHandler }) => {
  const { displaySettings } = useContext(WidgetDataContext);
  const intl = useIntl();

  const showFacetValues = (facet: Facet): ReactElement | ReactElement[] => {
    const priceRangeChangeHandler = (value: number | number[]): void => {
      setSelectedFilters((curFilters: Record<FacetType, any>) => {
        if (Array.isArray(value)) {
          curFilters.price = value;
        } else {
          curFilters.price = [value, value];
        }
        return curFilters;
      });
    };

    if (facet.range) {
      return <Slider
        label='Price Range'
        color='secondary'
        minValue={facet.range.min}
        maxValue={facet.range.max}
        defaultValue={[facet.range.min, facet.range.max]}
        onChange={priceRangeChangeHandler}
      />;
    }

    const facetName = getFacetNameByKey(displaySettings.productDetails, facet.key) as FacetType;
    const updateFiltersHandler = (event: ChangeEvent<HTMLInputElement>): void => {
      setSelectedFilters((currentFilters: Record<FacetType, any>) => {
        const newSet = new Set(currentFilters[facetName]);
        if (event.target.checked) {
          newSet.add(event.target.value);
        } else {
          newSet.delete(event.target.value);
        }

        return { ...currentFilters, [facetName]: newSet };
      });
    };

    return facet.items.map((item) => (
      <div className='flex w-full justify-between' key={item.value}>
        <Checkbox
          value={item.value}
          color='secondary'
          onChange={updateFiltersHandler}
          isSelected={selectedFilters[facetName].has(item.value)}
        >
          <span className='calls-to-action-text'>{item.value}</span>
        </Checkbox>
        <span className='calls-to-action-text'>({item.count})</span>
      </div>
    ));
  };

  return (
    <div className='md:justify-none flex h-full flex-col justify-between gap-y-2 p-1 md:h-[unset]'>
      <Accordion className='divide-y-1 overflow-y-auto' selectionMode='multiple'>
        {
          facets.map((facet) => (
            <AccordionItem
              key={facet.key}
              title={getTitleCase(getFacetNameByKey(displaySettings.productDetails, facet.key))}
              indicator={<LeftChevronIcon className='size-4'/>}
            >
              <div className='flex flex-col gap-y-2 px-4 pb-4'>
                {showFacetValues(facet)}
              </div>
            </AccordionItem>
          ))
        }
      </Accordion>
      {/* Apply button */}
      <Button className='rounded border bg-buttonPrimary text-white' radius='none' data-pw='esr-apply-filter-button' onClick={onApplyHandler}>
        <span className='text-buttonPrimary'>
          {intl.formatMessage({ id: 'embeddedSearchResults.apply' })}
        </span>
      </Button>
    </div>
  );
};

export default FilterOptions;
