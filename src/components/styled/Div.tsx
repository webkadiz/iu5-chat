import styled from '@emotion/styled';
import {
    colorMixin,
    displayMixin,
    flexMixin,
    fontMixin,
    marginMixin,
} from './mixins';
import { Fonts, Colors, Displays, Flexs, Margins } from './types';

const Div = styled.div<Fonts & Colors & Displays & Flexs & Margins>`
    ${fontMixin}
    ${colorMixin}
    ${displayMixin}
    ${flexMixin}
    ${marginMixin}
`;

export default Div;
