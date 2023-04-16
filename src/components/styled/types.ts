export type Margins = {
    mt?: number;
    mb?: number;
    ml?: number;
    mr?: number;
};

export type Fonts = {
    tiny?: boolean;
    small?: boolean;
    middle?: boolean;
    large?: boolean;
    reqular?: boolean;
    medium?: boolean;
    bold?: boolean;
};

export type Displays = {
    dblock?: boolean;
    diblock?: boolean;
    dinline?: boolean;
    dflex?: boolean;
    dnone?: boolean;
};

export type Flexs = {
    ai?: 'space-between' | 'flex-start' | 'flex-end' | 'center';
    jc?: 'space-between' | 'flex-start' | 'flex-end' | 'center';
};

export type Colors = {
    primary?: boolean;
    secondary?: boolean;
    brand?: boolean;
};
