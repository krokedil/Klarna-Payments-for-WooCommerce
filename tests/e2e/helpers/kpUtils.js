
/**
 * 
 * @param {*} window 
 * @param {*} selector 
 */
const selectOptionTab = async (window, selector, wait) => {

    console.log(wait)
    
    if( wait === true ){
        await window.waitForSelector(selector);
        await window.evaluate(
            (cb) => cb.click(),
            await window.$(selector)
        );
    } else {
        await window.evaluate(
            (cb) => cb.click(),
            await window.$(selector)
        );
    }
}

export default {
    selectOptionTab,
};