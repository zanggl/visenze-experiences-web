import type { FC, ReactElement } from 'react';
import { memo, useState } from 'react';
import { Button } from '@nextui-org/button';
import { cn } from '@nextui-org/theme';
import { Radio, RadioGroup } from '@nextui-org/radio';
import { useIntl } from 'react-intl';
import { SortType } from '../../../common/types/constants';
import type { ScreenType } from '../icon-triggered-grid';
import { getSortTypeIntlId } from '../../../common/utils';

/**
 * A component for selecting and applying product result sorting options.
 */

interface SortOptionsProps {
  sortType: SortType;
  setSortType: (selectedOption: SortType) => void;
  setScreen: (screen: ScreenType | null) => void;
  className: string;
}

const SortOptions: FC<SortOptionsProps> = ({ sortType, setSortType, setScreen, className }): ReactElement => {
  const [selectedOption, setSelectedOption] = useState<SortType>(sortType);
  const intl = useIntl();

  return (
    <div className={cn('bg-primary', className)}>
      <div className='primary-text py-3 text-center text-lg lg:py-0 lg:text-start'>{intl.formatMessage({ id: 'iconTriggeredGrid.sort' })}</div>
      <div className='calls-to-action-text flex h-full flex-col gap-2 border-1 p-4'>
        <RadioGroup
          value={selectedOption}
          onChange={(event) => setSelectedOption(event.target.value as SortType)}
          color='secondary'
        >
          <Radio value={SortType.RELEVANCE} data-pw='itg-sort-relevance'>{intl.formatMessage({ id: getSortTypeIntlId(SortType.RELEVANCE) })}</Radio>
          <Radio value={SortType.PRICE_HTL} data-pw='itg-sort-high-to-low'>{intl.formatMessage({ id: getSortTypeIntlId(SortType.PRICE_HTL) })}</Radio>
          <Radio value={SortType.PRICE_LTH} data-pw='itg-sort-low-to-high'>{intl.formatMessage({ id: getSortTypeIntlId(SortType.PRICE_LTH) })}</Radio>
        </RadioGroup>
      </div>

      {/* Cancel & Apply buttons */}
      <div className='flex justify-around py-4 lg:ml-auto lg:justify-normal lg:gap-4 lg:py-0'>
        <Button className='rounded border bg-white px-14 text-black' radius='none' onClick={() => setScreen(null)} data-pw='itg-cancel-sort-button'>
          {intl.formatMessage({ id: 'iconTriggeredGrid.cancel' })}
        </Button>
        <Button
          data-pw='itg-apply-sort-button'
          className='rounded border bg-buttonPrimary px-14 text-white'
          radius='none'
          onClick={() => {
            setSortType(selectedOption);
            setScreen(null);
          }}
        >
          <span className='text-buttonPrimary'>
            {intl.formatMessage({ id: 'iconTriggeredGrid.apply' })}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default memo(SortOptions);
