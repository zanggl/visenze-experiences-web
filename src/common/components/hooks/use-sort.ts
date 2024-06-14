import { useContext } from 'react';
import { useIntl } from 'react-intl';
import type { SortType } from '../../types/constants';
import { Actions, Labels } from '../../types/tracking-constants';
import { WidgetFilterContext, WidgetDataContext, WidgetResultContext } from '../../types/contexts';

interface SortLogic {
  onSort: () => void;
  onSortApply: (sort: SortType) => void;
  onSortCancel: () => void;
}

interface SortLogicProps {
  setScreen: (screen: 'sort' | 'filter' | null) => void;
}

const useSort = ({ setScreen }: SortLogicProps): SortLogic => {
  const intl = useIntl();
  const { productSearch } = useContext(WidgetDataContext);
  const { setSortMode } = useContext(WidgetFilterContext) ?? {};
  const { metadata } = useContext(WidgetResultContext);

  const onSort = (): void => {
    productSearch.send(Actions.LOAD, {
      label: Labels.SORT,
      ...metadata,
    });
    setScreen('sort');
  };

  const onSortApply = (sortType: SortType): void => {
    productSearch.send(Actions.CLICK, {
      label: Labels.SORT,
      ...metadata,
      sort: intl.formatMessage({ id: sortType }),
    });
    setSortMode?.(sortType);
    setScreen(null);
  };

  const onSortCancel = (): void => {
    productSearch.send(Actions.CLOSE, {
      label: Labels.SORT,
      ...metadata,
    });
    setScreen(null);
  };

  return {
    onSort,
    onSortApply,
    onSortCancel,
  };
};

export default useSort;
