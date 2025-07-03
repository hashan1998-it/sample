import {
    PiArrowsInDuotone,
    PiBookOpenUserDuotone,
    PiBookBookmarkDuotone,
    PiAcornDuotone,
    PiBagSimpleDuotone,
    PiStarHalfDuotone,
    PiPizzaDuotone,
    PiGearDuotone,
    PiGridFourDuotone,
    PiSirenDuotone,
    PiStorefrontDuotone,
    PiSpeedometerDuotone
} from 'react-icons/pi'
import type { JSX } from 'react'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    dashboard: <PiSpeedometerDuotone />,
    outlets: <PiStorefrontDuotone/>,
    menus: <PiGridFourDuotone/>,
    foods: <PiPizzaDuotone/>,
    reviews: <PiStarHalfDuotone/>,
    complaints: <PiSirenDuotone/>,
    settings: <PiGearDuotone/>,
    singleMenu: <PiAcornDuotone />,
    collapseMenu: <PiArrowsInDuotone />,
    groupSingleMenu: <PiBookOpenUserDuotone />,
    groupCollapseMenu: <PiBookBookmarkDuotone />,
    groupMenu: <PiBagSimpleDuotone />,
}

export default navigationIcon
