import type { ReactElement } from 'react';
import { useEffect, useContext, useState } from 'react';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { cn } from '@nextui-org/theme';
import { RootContext } from '../../common/components/shadow-wrapper';
import type { SearchImage } from '../../common/types/image';
import MagnifyingGlassIcon from '../../common/icons/MagnifyingGlassIcon';
import SearchBarInput from './components/SearchBarInput';
import SearchBarTextArea from './components/SearchBarTextArea';
import useAutocomplete from '../../common/components/hooks/use-autocomplete';
import { WidgetDataContext } from '../../common/types/contexts';

const SearchBar = (): ReactElement => {
  const { searchBarResultsSettings } = useContext(WidgetDataContext);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [image, setImage] = useState<SearchImage | undefined>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOnResultsPage, setIsOnResultsPage] = useState(false);
  const root = useContext(RootContext);

  const {
    imageId,
    autocompleteResults,
    error,
  } = useAutocomplete({
    image,
    query: debouncedQuery,
  });

  const handleRedirect = (): void => {
    if (!query && !image) {
      return;
    }

    const url = new URL(searchBarResultsSettings.redirectUrl);
    if (query) {
      url.searchParams.append('searchBarQuery', query);
    }
    if (imageId) {
      url.searchParams.append('searchBarImageId', imageId);
    }
    window.location.href = url.toString();

    if (isOnResultsPage) {
      // Reload results
      const reloadEmbeddedSearchResultsEvent = new CustomEvent('reload-embedded-search-results');
      document.dispatchEvent(reloadEmbeddedSearchResultsEvent);
    }
  };

  document.addEventListener('add-image-to-search-bar', (e) => {
    setImage({ imgUrl: (e as any).detail.im_url });
  });

  useEffect(() => {
    if (!query) setShowDropdown(false);
    else setShowDropdown(true);
  }, [query]);

  useEffect(() => {
    if (imageId) {
      handleRedirect();
    }
  }, [imageId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return (): void => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    const redirectUrl = new URL(searchBarResultsSettings.redirectUrl);
    if (window.location.origin === redirectUrl.origin && window.location.pathname === redirectUrl.pathname) {
      setIsOnResultsPage(true);
    }
  }, []);

  if (!root || error) {
    if (error) console.error(error);
    return <></>;
  }

  return (
    <>
      <div className='flex size-full flex-col bg-primary'>
        <div className='relative flex w-full flex-col items-center'>
          {/* Search bar */}
          {
            image && isOnResultsPage
            ? <SearchBarTextArea image={image} query={query} setQuery={setQuery} setImage={setImage}
                                 handleRedirect={handleRedirect} setShowDropdown={setShowDropdown} />
            : <SearchBarInput query={query} setQuery={setQuery} setImage={setImage}
                              handleRedirect={handleRedirect} setShowDropdown={setShowDropdown} />
          }

          {/* Autocomplete dropdown */}
          {
            <Listbox
              onAction={(key) => { setQuery(String(key)); setShowDropdown(false); }}
              classNames={{
                base: cn(
                  'absolute rounded-md max-h-52 w-full overflow-y-auto border-gray-200 bg-white transition-all z-20',
                  showDropdown && autocompleteResults.length > 0 ? 'border-b-1 border-x-1' : 'border-none hidden',
                  image ? 'top-[210px]' : 'top-12',
                ),
              }}
              aria-label='Autocomplete Dropdown'
            >
              <ListboxSection classNames={{ base: 'mb-0' }}>
                {autocompleteResults.map((result, index) => (
                  <ListboxItem
                    tabIndex={0}
                    className='pr-4'
                    key={result}
                    endContent={<MagnifyingGlassIcon className='size-4'/>}
                    textValue={result}
                  >
                    <span className='calls-to-action-text pl-2 text-primary'
                          data-pw={`sb-autocomplete-suggestion-${index + 1}`}>{result}</span>
                  </ListboxItem>
                ))}
              </ListboxSection>
            </Listbox>
          }
        </div>
      </div>
    </>
  );
};

export default SearchBar;
