function convertToJson(data) {
  const json = {};

  data.forEach(obj => json[obj.name] = obj.value);

  return json;
}

function formatDigits(time) {
  return String(time).length < 2 ? `0${time}` : String(time);
}

function getSuffix(date) {
  if (date === 11 || date === 12 || date === 13) {
    return 'th';
  } else if (date % 10 === 1) {
    return 'st';
  } else if (date % 10 === 2) {
    return 'nd';
  } else if (date % 10 === 3) {
    return 'rd';
  } else {
    return 'th';
  }
}

function formatDate(dateObj) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[dateObj.getMonth()];
  const suffix = getSuffix(dateObj.getDate());
  const hours = `${formatDigits(dateObj.getHours())}`;
  const minutes = `${formatDigits(dateObj.getMinutes())}`;
  const seconds = `${formatDigits(dateObj.getSeconds())}`;
  const time = `${hours}:${minutes}:${seconds}`;

  return `${month} ${dateObj.getDate()}${suffix}, ${dateObj.getYear() + 1900} ` + time;
}

function formatDateTime(dateObj) {
  const date = dateObj.toLocaleDateString();
  const hours = `${formatDigits(dateObj.getHours())}`;
  const minutes = `${formatDigits(dateObj.getMinutes())}`;
  const seconds = `${formatDigits(dateObj.getSeconds())}`;
  const time = `${hours}:${minutes}:${seconds}`;

  return `${date}T${time}`;
};

const Templates = {};

$('[type="text/x-handlebars"]').each((i, template) => {
  const $template = $(template).remove();

  Templates[$template.attr('id')] = Handlebars.compile($template.html());
});
const ProductModel = Backbone.Model.extend({
  defaults: {
    date: new Date(),
    categories: ['food'],
  },
  initialize () {
    const newDate = new Date(this.get('date'));

    this.set('datetime', formatDateTime(newDate));
    this.set('date_formatted', formatDate(newDate));
  }
});
const product = new ProductModel(product_json);
const $form = $('form');

$('article').html(Templates.product(product.attributes));
$('fieldset').html(Templates.form(product.attributes));
$form.on('submit', e => {
  e.preventDefault();

  const data = $form.serializeArray();
  const json = convertToJson(data);

  const newProduct = new ProductModel(json);
  $('article').html(Templates.product(newProduct.attributes));
});
