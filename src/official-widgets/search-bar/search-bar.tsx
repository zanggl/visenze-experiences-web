import type { ReactElement } from 'react';
import { useEffect, useContext, useState } from 'react';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/listbox';
import { cn } from '@nextui-org/theme';
import { RootContext } from '../../common/components/shadow-wrapper';
import type { SearchImage } from '../../common/types/image';
import { isImageUrl } from '../../common/types/image';
import MagnifyingGlassIcon from '../../common/icons/MagnifyingGlassIcon';
import SearchBarInput from './components/SearchBarInput';
import SearchBarTextArea from './components/SearchBarTextArea';
import useAutocomplete from '../../common/components/hooks/use-autocomplete';
import { WidgetDataContext } from '../../common/types/contexts';

const SearchBar = (): ReactElement => {
  const { searchBarResultsSettings, debugMode } = useContext(WidgetDataContext);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [image, setImage] = useState<SearchImage | undefined>();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOnResultsPage, setIsOnResultsPage] = useState(false);
  const [allowRedirect, setAllowRedirect] = useState(false);
  const root = useContext(RootContext);

  const {
    imageId,
    autocompleteResults,
    error,
  } = useAutocomplete({
    image,
    query: debouncedQuery,
  });

  const redirectWithAutocomplete = (autocomplete: string): void => {
    const url = new URL(searchBarResultsSettings.redirectUrl);
    url.searchParams.append('q', autocomplete);
    if (imageId) {
      url.searchParams.append('im_id', imageId);
    }
    window.location.href = url.toString();
  };

  const handleRedirect = (): void => {
    if ((!query && !image) || debugMode) {
      return;
    }

    const url = new URL(searchBarResultsSettings.redirectUrl);
    if (query) {
      url.searchParams.append('q', query);
    }
    if (imageId) {
      url.searchParams.append('im_id', imageId);
    }
    if (image && isImageUrl(image)) {
      url.searchParams.append('im_url', image.imgUrl);
    }
    window.location.href = url.toString();
  };

  useEffect(() => {
    if (!query) setShowDropdown(false);
    else setShowDropdown(true);
  }, [query]);

  useEffect(() => {
    if (imageId && allowRedirect) {
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
    const urlSearchParams = new URLSearchParams(window.location.search);
    const searchBarQuery = urlSearchParams.get('q');
    const searchBarImageUrl = urlSearchParams.get('im_url');
    if (searchBarQuery) {
      setQuery(searchBarQuery);
    }
    if (searchBarImageUrl) {
      setImage({ imgUrl: searchBarImageUrl });
    }
  }, []);

  useEffect(() => {
    const redirectUrl = new URL(searchBarResultsSettings.redirectUrl);
    if (window.location.origin === redirectUrl.origin && window.location.pathname === redirectUrl.pathname) {
      setIsOnResultsPage(true);
    }

    const addImageToSearchBarListener = (event: Event): void => {
      setImage({ imgUrl: (event as CustomEvent).detail.im_url });
    };
    document.addEventListener('add-image-to-search-bar', addImageToSearchBarListener);

    return (): void => {
      document.removeEventListener('add-image-to-search-bar', addImageToSearchBarListener);
    };
  }, []);

  if (error) {
    console.error(error);
  }

  if (!root) {
    return <></>;
  }

  return (
    <>
      <div className='flex size-full flex-col bg-primary'>
        <div className='relative flex w-full flex-col items-center'>
          {/* Search bar */}
          {
            image && isOnResultsPage
            ? <SearchBarTextArea image={image} query={query} setQuery={setQuery} setImage={setImage} setAllowRedirect={setAllowRedirect}
                                 handleRedirect={handleRedirect} setShowDropdown={setShowDropdown} />
            : <SearchBarInput query={query} setQuery={setQuery} setImage={setImage} setAllowRedirect={setAllowRedirect}
                              handleRedirect={handleRedirect} setShowDropdown={setShowDropdown} />
          }

          {/* Autocomplete dropdown */}
          {
            <Listbox
              onAction={(key) => { redirectWithAutocomplete(String(key)); }}
              classNames={{
                base: cn(
                  'absolute rounded-b-md max-h-52 w-full overflow-y-auto border-gray-200 bg-white transition-all z-20',
                  showDropdown && autocompleteResults.length > 0 ? 'border-b-1 border-x-1' : 'border-none hidden',
                  image ? 'top-[75px]' : 'top-12',
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
