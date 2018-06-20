/*
 * Copyright © 2015-2018 Serenova, LLC. All rights reserved.
 */

// Check if browser used is IE11 or greater
// Returns undefined for Chrome|Firefox|Edge
export const isIeEleven = () => document.documentMode && document.documentMode >= 11;
