import styled from '@emotion/styled';
import { colorMixin, displayMixin, fontMixin, marginMixin } from './mixins';
import { Fonts, Colors, Displays, Margins } from './types';

const Span = styled.span<Fonts & Colors & Displays & Margins>`
    ${fontMixin}
    ${colorMixin}
    ${displayMixin}
    ${marginMixin}
`;

export default Span;
