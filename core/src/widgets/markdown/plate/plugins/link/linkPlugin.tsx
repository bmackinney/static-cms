import { PlateFloatingLink } from '@udecode/plate';

import type { LinkPlugin } from '@udecode/plate';
import type { MdPlatePlugin } from '../../plateTypes';

export const linkPlugin: Partial<MdPlatePlugin<LinkPlugin>> = {
  renderAfterEditable: PlateFloatingLink as MdPlatePlugin['renderAfterEditable'],
};
