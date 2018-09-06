import { shallowMount, createLocalVue} from "@vue/test-utils";
import sinon from "sinon";

import home from "../../src/pages/home.vue";
import src from "../../src/directives/src";
import chart from "../../src/components/chart.vue";


const localVue = createLocalVue()

localVue.use(src)

describe('this is a testing for home.vue', () => {
    const wrapper = new shallowMount(home, {
        localVue
    })

    it('should be a vue instance', () => {
        expect(wrapper.isVueInstance()).toBeTruthy()
    })

    it('should has img tag that own src', () => {
        const imgWrapper = wrapper.find('img.img-middle')

        expect(imgWrapper).toBeTruthy()
        expect(imgWrapper.element.src).toEqual('https://pic.cr173.com/up/2017-1/201713954335202.png')
    })
    
    it('should contain the root of component charts', () => {
        expect(wrapper.contains(chart)).toBe(true)
    })

    it('click the div will add 1', function () {
        const divWrapper = wrapper.find('div.btn-add')
        divWrapper.trigger('click')
        
        expect(wrapper.vm.mark).toBe(1)
    })
})



describe.only('to test api called with mock', () => {
    var callback = sinon.fake()

    const wrapper = new shallowMount(home, {
        localVue,
        propsData: {
            callee: callback
        }
    })

    var itemWrapper

    it('should receive a list from mounted hook by mock api', (done) => {
        wrapper.vm.$nextTick(() => {
            expect(wrapper.vm.mockList[0]).toBe(1)
            itemWrapper = wrapper.find('div.item')
            expect(itemWrapper.element.textContent).toBe('1')

            itemWrapper.trigger('click')
            expect(itemWrapper.element.textContent).toBe('2')

            done()
        })
    })

    it('callback will be called twice', () => {
        itemWrapper.trigger('click')
        expect(callback.callCount).toBe(2)
        expect(callback.calledWith(1, 2, 3)).toBeTruthy()
        expect(callback.calledOn(wrapper.vm)).toBeTruthy()
    })
})
