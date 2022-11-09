import { ELEMENT_H1 } from '@udecode/plate';

import type { NormalizeTypesPlugin } from '@udecode/plate';
import type { MdPlatePlugin } from '../../plateTypes';

export const forcedLayoutPlugin: Partial<
  MdPlatePlugin<NormalizeTypesPlugin>
> = {
  options: {
    rules: [{ path: [0], strictType: ELEMENT_H1 }],
  },
};
