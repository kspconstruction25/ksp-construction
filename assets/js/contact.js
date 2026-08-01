$(document).ready(function () {
    (function ($) {
        "use strict";

        jQuery.validator.addMethod('answercheck', function (value, element) {
            return this.optional(element) || /^\bcat\b$/.test(value);
        }, "type the correct answer -_-");

        $(function () {
            $('#contactForm').validate({
                // Custom error styling
                errorElement: 'small',
                errorClass: 'custom-error',
                errorPlacement: function (error, element) {
                    error.css('color', '#ff5e14');
                    error.insertAfter(element);
                },
                rules: {
                    name: {
                        required: true,
                        minlength: 2
                    },
                    subject: {
                        required: true,
                        minlength: 4
                    },
                    phone: {
                        required: true,
                        minlength: 5
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    message: {
                        required: true,
                        minlength: 10
                    }
                },
                messages: {
                    name: {
                        required: "Please enter your full name.",
                        minlength: "Your name must be at least 2 characters long."
                    },
                    subject: {
                        required: "Please specify the subject.",
                        minlength: "Subject must be at least 4 characters long."
                    },
                    phone: {
                        required: "Please enter your contact number.",
                        minlength: "Please enter a valid phone number."
                    },
                    email: {
                        required: "Please enter a valid email address."
                    },
                    message: {
                        required: "Please enter your message or project details.",
                        minlength: "Your message should be at least 10 characters long."
                    }
                },
                submitHandler: function (form) {
                    const $submitBtn = $('#submitBtn');
                    $submitBtn.prop('disabled', true).html('Sending... <i class="fa fa-spinner fa-spin ml-2"></i>');

                    // Collect form data safely
                    const data = {
                        name: form.name.value,
                        email: form.email.value,
                        phone: form.phone.value,
                        subject: form.subject.value,
                        message: form.message.value,
                        time: new Date().toLocaleString()
                    };

                    // Send via EmailJS
                    emailjs.send(
                        "service_of85deu",
                        "template_i3fdvrm",
                        data
                    ).then(function () {
                        // Construct WhatsApp message
                        const whatsappMessage =
                            `*New Website Enquiry*

                            Name: ${data.name}
                            Phone: ${data.phone}
                            Email: ${data.email}

                            Subject:
                            ${data.subject}

                            Message:
                            ${data.message}

                            Time: ${data.time}`;

                        // Open WhatsApp window
                        window.open(
                            `https://wa.me/919944439987?text=${encodeURIComponent(whatsappMessage)}`,
                            "_blank"
                        );

                        // Hide Form & Show Thank You Card
                        $('#contactForm').fadeOut(400, function () {
                            $('#formSuccess').fadeIn(400);
                        });

                        // 6-second countdown timer reset handler
                        let timeLeft = 6;
                        $('#countdown').text(timeLeft);

                        const timerInterval = setInterval(function () {
                            timeLeft--;
                            $('#countdown').text(timeLeft);

                            if (timeLeft <= 0) {
                                clearInterval(timerInterval);

                                // Reset states and restore Form
                                $('#formSuccess').fadeOut(400, function () {
                                    form.reset();
                                    $submitBtn.prop('disabled', false).html('Send Message <i class="fa fa-paper-plane ml-2"></i>');
                                    $('#contactForm').fadeIn(400);
                                });
                            }
                        }, 1000);

                    }).catch(function (err) {
                        alert("Unable to send message. Please try again later.");
                        console.error("EmailJS Error:", err);
                        $submitBtn.prop('disabled', false).html('Send Message <i class="fa fa-paper-plane ml-2"></i>');
                    });
                }
            });
        });
    })(jQuery);
});