jQuery(function() {
    var addError, driverLicenseId, email, firstName, gender, getId, getIds, isValidEmailAddress, lastName, password, removeError, repeatPassword, required, setError, trimField, verifyEmailAddressField, verifyPasswordsMatch, verifyRequiredField, verifyRequiredRadio;
    getId = function(id) {
      return $("#" + id);
    };
    getIds = function(list) {
      var id, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = list.length; _i < _len; _i++) {
        id = list[_i];
        _results.push(getId(id));
      }
      return _results;
    };
    addError = function(elem, level, message) {
      var i, target, _i, _ref;
      target = elem;
      for (i = _i = 0, _ref = level - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        target = target.parent();
      }
      target.parent().addClass('error');
      return target.append("<span class=\"help-inline\">" + message + "</span>");
    };
    removeError = function(elem, level) {
      var i, target, _i, _ref;
      target = elem;
      for (i = _i = 0, _ref = level - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        target = target.parent();
      }
      target.parent().removeClass('error');
      return target.children().filter('.help-inline').remove();
    };
    setError = function(elem, level, message) {
      removeError(elem, level);
      return addError(elem, level, message);
    };
    isValidEmailAddress = function(email) {
      var pattern;
      pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
      return pattern.test(email);
    };
    trimField = function(field) {
      return field.val($.trim(field.val()));
    };
    verifyRequiredField = function(field) {
      if (!field.val()) {
        setError(field, 2, 'Field required.');
        return false;
      } else {
        removeError(field, 2);
        return true;
      }
    };
    verifyEmailAddressField = function(field) {
      if (field.val()) {
        if (!isValidEmailAddress(email.val())) {
          setError(email, 2, 'Invalid email address.');
        } else {
          removeError(email, 2);
          return true;
        }
      }
      return false;
    };
    verifyPasswordsMatch = function(fieldA, fieldB) {
      if (!fieldA.val() || !fieldB.val()) {
        return false;
      }
      if (fieldA.val() !== fieldB.val()) {
        setError(fieldB, 2, 'Passwords don\'t match.');
        return false;
      } else {
        removeError(fieldB, 2);
        return true;
      }
    };
    verifyRequiredRadio = function(radioInputList) {
      var input, selected, _i, _len;
      selected = false;
      for (_i = 0, _len = radioInputList.length; _i < _len; _i++) {
        input = radioInputList[_i];
        if (input.prop('checked')) {
          selected = true;
        }
      }
      if (selected) {
        removeError(radioInputList[0], 3);
      } else {
        if (radioInputList) {
          setError(radioInputList[0], 3, 'Field required.');
        }
      }
      return selected;
    };
    firstName = getId('register-first-name');
    lastName = getId('register-last-name');
    email = getId('register-email');
    password = getId('register-password');
    repeatPassword = getId('register-repeat-password');
    driverLicenseId = getId('register-driver-license-id');
    gender = getIds(['register-male', 'register-female']);
    required = [firstName, lastName, email, password, repeatPassword];
    $.each(required, function() {
      var field;
      field = this;
      return field.bind('blur', function() {
        trimField(field);
        return verifyRequiredField(field);
      });
    });
    email.bind('blur', function() {
      return verifyEmailAddressField(email);
    });
    repeatPassword.bind('blur', function() {
      return verifyPasswordsMatch(password, repeatPassword);
    });
    return $('#register').submit(function() {
      var errors, field, _i, _len;
      errors = false;
      for (_i = 0, _len = required.length; _i < _len; _i++) {
        field = required[_i];
        if (!verifyRequiredField(field)) {
          errors = true;
        }
      }
      if (!verifyEmailAddressField(email)) {
        errors = true;
      }
      if (!verifyPasswordsMatch(password, repeatPassword)) {
        errors = true;
      }
      if (!verifyRequiredRadio(gender)) {
        errors = true;
      }
      return !errors;
    });
  });