'use strict';

const form = document.querySelector('#registrationForm');

const formValidation = () => {

    form.setAttribute('novalidate', '');

    form.addEventListener('submit', e => {

        const formValid = validateFormDetails(form)

        if (formValid) {
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form)
            })
            .then((res) => res.join())
            .then(() => {
                const succM = document.querySelector ('.succM');
                succM.style.color = 'green';
                succM.textContent = 'You have successfully completed your registration';
                setTimeout(() => {
                    succM.textContent = '';
                }, 5000);
                form.reset()

            }).then(() => {
                open('success.html', '___blank')
            })
        }

    }) 
    

    const formElToBlur = Array.from(form)
    // console.log(formElToBlur)


        formElToBlur.forEach((formEl) => {
            formEl.addEventListener('blur', (e) =>  {
                validateSingleDetails(e.srcElement.parentElement.parentElement.parentElement);
            })
            
        })

    }

    formValidation()

    const validateOptions = [
        
        {
            attribute: 'minlength',
            isValid: input => input.value && input.value.length >= input.minLength,
            errorMessage:( input, label) => `${label.textContent} needs to be atleast ${input.minLength} characters`

        },

        {
            attribute: 'pattern',
            isValid: input => {
                const regex = new RegExp(input.pattern)
               return regex.test(input.value)
                
            },
            errorMessage: (input, label) => `${input.value} is not a valid ${label.textContent}`
        },

        {
            attribute: 'custommaxlength',
            isValid: input => input.value && input.value.length <= input.getAttribute ('custommaxlength'),
            errorMessage: (input, label) => `${label.textContent} needs to be at ${input.getAttribute ('custommaxlength')} or less than ${input.getAttribute('custommaxlength')} characters`
        },

        {
            attribute: 'match',
            isValid: input => {
                const selectorEl = input.getAttribute ('match');
                const elToMatch = form.querySelector(`#${selectorEl}`)
                 return elToMatch && elToMatch.value.trim() === input.value.trim()
            },
            errorMessage: (input, label) => {
                const SelectorEl = input.getAttribute('match');
                const elToMatch = form.querySelector(`#${SelectorEl}`)

                const elToMatchLabel = elToMatch.parentElement.parentElement.querySelector('label')

                return `${label.textContent} must match ${elToMatchLabel.textContent}`
            },

        },

        {
            attribute: 'required',
            isValid: input =>input.value.trim() !== '',
    
            errorMessage: (input, label) => `${label.textContent} is rquired,kindly fill this field `
            
        },

        
    ]
                                        ///////////////////////////

    const validateSingleDetails = (formDetail) => {
        const label = formDetail.querySelector('label');
        const input = formDetail.querySelector('input');
        const successIcon = formDetail.querySelector('.success-check');
        const errorIcon = formDetail.querySelector('.error-check');
        const errorMessEl = formDetail.querySelector('.errorMessage');
    
        let errorDetail = false;
    
        
        for (const options of validateOptions) {
            if(input.hasAttribute(options.attribute) && !options.isValid(input)) {
                errorMessEl.textContent = options.errorMessage(input, label)
                input.classList.remove('greenBorder');
                input.classList.add('redBorder');
                errorIcon.style.display = 'inline';
                successIcon.style.display = 'none'

                errorDetail = true
            }
            if(!errorDetail) {
                errorMessEl.textContent = '';
                input.classList.add('greenBorder');
                input.classList.remove('redBorder')
                successIcon.style.display = 'inline';
                errorIcon.style.display = 'none';
            }
        }

        return !errorDetail
    }
    
 formValidation();


 const validateFormDetails = (formToValidate) => {
    const formDetailsEl = Array.from(formToValidate.querySelectorAll('.formDetails'))
    return formDetailsEl.every((formDetails) => validateSingleDetails(formDetails))

}
 