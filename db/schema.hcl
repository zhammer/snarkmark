schema "public" {}

table "jstor_articles" {
  schema = schema.public
  column "item_id" {
    type = uuid
  }
  column "title" {
    type = text
  }
  column "published_date" {
    type = varchar(20)
  }
  column "creators_string" {
    type = text
  }
  column "url" {
    type = text
  }
  primary_key {
    columns = [column.item_id]
  }
}

table "users" {
  schema = schema.public
  column "id" {
    type = serial
  }
  column "email" {
    type = text
  }
  column "username" {
    type = text
  }
  unique "username_unique" {
    columns = [column.username]
  }
  unique "email_unique" {
    columns = [column.email]
  }
  column "created_at" {
    type    = timestamp
    default = sql("now()")
  }
  primary_key {
    columns = [column.id]
  }
}

table "marks" {
  schema = schema.public
  column "id" {
    type = serial
  }
  column "item_id" {
    type = uuid
  }
  column "user_id" {
    type = integer
  }
  column "note" {
    type = text
    nullable = true
  }
  column "rating" {
    type = integer
    nullable = true
  }
  column "liked" {
    type = boolean
    default = false
  }
  column "created_at" {
    type = timestamp
    default = sql("now()")
  }
  primary_key {
    columns = [column.id]
  }
}
