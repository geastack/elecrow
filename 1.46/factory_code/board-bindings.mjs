import { inertPluginInstance } from '@geastack/compiler/plugin'

const bulb = 'gea::platform::elecrow::lights::setBulbPercent'

export const geatscPlugin = () => ({
  name: 'crowpanel-rotary-146',
  instantiate() {
    return {
      ...inertPluginInstance,
      capabilities: {
        ...inertPluginInstance.capabilities,
        hostFunctions: new Map([['setBulbPercent', bulb]]),
        hostPreambles: new Map([
          [bulb, ['namespace gea::platform::elecrow::lights { void setBulbPercent(double); }']],
        ]),
      },
    }
  },
})
