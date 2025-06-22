import { Confirmation } from "@/components/confirm";

import {
    confirmable as baseConfirmable,
    createConfirmationCreater,
    createMountPoint,
    createReactTreeMounter,
} from "react-confirm";

const mounter = createReactTreeMounter();

export const createConfirmation = createConfirmationCreater(mounter);
export const MountPoint = createMountPoint(mounter);
export const confirmable = baseConfirmable;

export const confirm = createConfirmation(Confirmation);
