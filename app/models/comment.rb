# frozen_string_literal: true

# コメント model
class Comment < ApplicationRecord
  belongs_to :idea
end
