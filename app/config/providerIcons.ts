const Icons = {
    airline: {
        name: 'airline',
        size: 24,
    },
    hotel: {
        name: 'hotel',
        size: 24,
    },
    rental: {
        name: 'rental',
        size: 24,
    },
    train: {
        name: 'train',
        size: 24,
    },
    other: {
        name: 'other',
        size: 24,
    },
    'credit-card': {
        name: 'credit-card',
        size: 24,
    },
    shopping: {
        name: 'shopping',
        size: 24,
    },
    dining: {
        name: 'dining',
        size: 24,
    },
    survey: {
        name: 'survey',
        size: 24,
    },
    cruise: {
        name: 'cruise',
        size: 24,
    },
    custom: {
        name: 'custom',
        size: 24,
    },
    voucher: {
        name: 'voucher',
        size: 24,
    },
    document: {
        name: 'document',
        size: 24,
    },
    passport: {
        name: 'passport',
        size: 24,
    },
    'traveler-number': {
        name: 'traveler-number',
        size: 24,
    },
    vaccine: {
        name: 'vaccine',
        size: 24,
    },
    visa: {
        name: 'visa',
        size: 24,
    },
    insurance: {
        name: 'insurance',
        size: 24,
    },
    'drivers-license': {
        name: 'drivers-license',
        size: 24,
    },
    parking: {
        name: 'parking',
        size: 24,
    },
    'priority-pass': {
        name: 'priority-pass',
        size: 24,
    },
};

const ProviderIcons = {
    0: {
        name: 'custom',
        size: 24,
    },
    1: Icons.airline,
    2: Icons.hotel,
    3: Icons.rental,
    4: Icons.train,
    5: Icons.other,
    6: Icons['credit-card'],
    7: Icons.shopping,
    8: Icons.dining,
    9: Icons.survey,
    10: Icons.cruise,
    11: Icons.document,
    12: Icons.parking,
    custom: Icons.custom,
    coupon: Icons.voucher,
    passport: Icons.passport,
    'traveler-number': Icons['traveler-number'],
    'vaccine-card': Icons.vaccine,
    'insurance-card': Icons.insurance,
    'drivers-license': Icons['drivers-license'],
    visa: Icons.visa,
    'priority-pass': Icons['priority-pass'],
};

export default ProviderIcons;
export {Icons};
