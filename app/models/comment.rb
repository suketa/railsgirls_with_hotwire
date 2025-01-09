# frozen_string_literal: true

# コメント model
class Comment < ApplicationRecord
  belongs_to :idea

  validates :user_name, presence: true
  validates :body, presence: true
end
