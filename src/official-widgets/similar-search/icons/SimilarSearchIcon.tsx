import type { FC, ReactElement, ReactNode } from 'react';

interface SimilarSearchIconProps {
    children?: ReactNode;
}

const SimilarSearchIcon: FC<SimilarSearchIconProps> = ({ children }): ReactElement => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='black'
    viewBox='0 0 500 500'
    strokeWidth={1.5}
    stroke='currentColor'
    className='size-6'
    data-pw='similar-search-icon'
  >
      <ellipse
        cx='249.446'
        cy='160.686'
        rx='106.587'
        ry='106.587'
        transform='matrix(1, 0, 0, 1, 2.842170943040401e-14, 7.105427357601002e-15)'
      />
      <ellipse
        cx='65.012'
        cy='165.086'
        rx='57.154'
        ry='57.154'
        transform='matrix(1, 0, 0, 1, 2.842170943040401e-14, 7.105427357601002e-15)'
      />
      <ellipse
        cx='434.904'
        cy='165.113'
        rx='57.154'
        ry='57.154'
        transform='matrix(1, 0, 0, 1, 2.842170943040401e-14, 7.105427357601002e-15)'
      />
      <ellipse style={{ stroke: '#fff', fill: '#fff' }} cx='65.099' cy='165.908' rx='38.538' ry='38.538' />
      <ellipse style={{ stroke: '#fff', fill: '#fff' }} cx='435.086' cy='166.127' rx='38.538' ry='38.538' />
      {children}
  </svg>
);

export default SimilarSearchIcon;
